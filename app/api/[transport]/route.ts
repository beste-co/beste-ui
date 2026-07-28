import { SITE_ORIGIN } from "@/lib/site-links";
import { AsyncLocalStorage } from "node:async_hooks";
import { readFile } from "node:fs/promises";
import { blockJsonPath } from "@/lib/registry-paths";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { categoryInfoMap } from "@/lib/category-info";
import {
  DEFAULT_REGISTRY_FLAVOR,
  blockInstallCommand,
  componentInstallCommand,
  pieceInstallCommand,
  withFlavor,
} from "@/lib/install-command";
import { validateLicenseCredentials } from "@/lib/entitlements";
import { readItemSource } from "@/lib/registry-serving";
import { hybridSearch } from "@/lib/search-core";
import { type AssetType, type IndexItem, loadIndex } from "@/lib/search-index";

export const runtime = "nodejs";
export const maxDuration = 60;

// The origin every generated URL is written against; see lib/site-links.ts.
const SITE_URL = SITE_ORIGIN;

// Per-request license credentials, threaded from the endpoint URL query params
// (?email=&license_key=) into the tool callbacks (mcp-handler doesn't expose
// the raw request to tools). Tool args can override as a fallback.
interface Creds {
  email?: string;
  licenseKey?: string;
}
const licenseCtx = new AsyncLocalStorage<Creds>();

function findItem(name: string, type?: AssetType): IndexItem | undefined {
  const { items } = loadIndex();
  if (type) return items.find((i) => i.type === type && i.name === name);
  // No type given: prefer block, then piece, then component.
  const order: AssetType[] = ["block", "piece", "component"];
  for (const t of order) {
    const hit = items.find((i) => i.type === t && i.name === name);
    if (hit) return hit;
  }
  return undefined;
}

function installCommandFor(item: IndexItem, flavor: "base" | "radix", creds?: Creds): string {
  if (item.type === "block") {
    const cmd =
      creds?.email && creds.licenseKey
        ? blockInstallCommand(item.name, { email: creds.email, licenseKey: creds.licenseKey })
        : blockInstallCommand(item.name);
    return withFlavor(cmd, flavor);
  }
  const cmd = item.type === "piece" ? pieceInstallCommand(item.name) : componentInstallCommand(item.name);
  return withFlavor(cmd, flavor);
}

async function readBlockJsonSource(item: IndexItem, flavor: "base" | "radix"): Promise<string | null> {
  const filePath = blockJsonPath(item.name, item.isPro, flavor);
  try {
    const raw = await readFile(filePath, "utf-8");
    const json = JSON.parse(raw);
    return json.files?.[0]?.content ?? null;
  } catch {
    return null;
  }
}

const jsonText = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

/**
 * Placement rules per asset type, surfaced on every result so a consuming
 * agent uses each asset correctly. The important one is `piece`: pieces are
 * asset-like and must ONLY sit inside a block's media slot — never as a
 * standalone section, and never as an interactive/fillable control.
 */
const PLACEMENT: Record<AssetType, string> = {
  block:
    "Full page section. Place it directly on the page as-is; it owns its own layout, spacing, and interactivity.",
  piece:
    "ASSET ONLY. A piece is a small visual widget (mini card, chart, stat tile, notification, logo wall, URL pill, etc.) meant to be embedded inside a block's media slot — the image/video/component slot of a card, hero, or feature row. Do NOT render a piece as a standalone section, and do NOT place it as an interactive or fillable control (form field, button, tab, filter) inside a section. If you need a functional section use a `block`; if you need an interactive primitive use a `component`.",
  component:
    "Design-system primitive (button, badge, input, filter control, etc.). Compose it inside a block or your own section — it is not a full page section on its own.",
};

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search_blocks",
      "Search Beste UI's catalog by natural language. Returns ranked matches with name, title, category, Pro status, page URL, and a `placement` rule. Asset types differ in how they may be used: a `block` is a full page section; a `piece` is an ASSET that only belongs inside a block's media slot (never a standalone section, never an interactive/fillable control); a `component` is a design-system primitive composed inside sections. Always honor each result's `placement` field — do not render a piece as a section or interactive element.",
      {
        query: z.string().describe("Natural-language description of the UI you want, e.g. 'pricing table with monthly/yearly toggle'"),
        type: z.enum(["block", "piece", "component", "all"]).optional().describe("Restrict to one asset type (default: all)"),
        category: z.string().optional().describe("Optional category filter, e.g. 'Hero', 'Pricing'"),
        limit: z.number().int().min(1).max(30).optional(),
      },
      async ({ query, type, category, limit }) => {
        const types =
          type && type !== "all" ? [type as AssetType] : undefined;
        let results = await hybridSearch(query, { types, limit: limit ?? 12 });
        if (category) {
          const c = category.toLowerCase();
          results = results.filter((r) => r.category.toLowerCase() === c);
        }
        return jsonText(
          results.map((r) => ({
            type: r.type,
            name: r.name,
            title: r.title,
            category: r.category,
            isPro: r.isPro,
            url: `${SITE_URL}${r.href}`,
            placement: PLACEMENT[r.type],
          }))
        );
      }
    );

    server.tool(
      "get_block",
      "Get metadata for a single block, piece, or component: title, description, category, Pro status, preview URL, install command, and a `placement` rule. Note the `placement`: a `piece` is asset-only (media slots inside a block, never a standalone section or interactive control); a `component` is a primitive composed inside sections; a `block` is a full section.",
      {
        name: z.string(),
        type: z.enum(["block", "piece", "component"]).optional(),
        flavor: z.enum(["base", "radix"]).optional().describe("Registry flavor for the install command (default: base)"),
      },
      async ({ name, type, flavor }) => {
        const item = findItem(name, type as AssetType | undefined);
        if (!item) return jsonText({ error: "not_found", name });
        const creds = licenseCtx.getStore();
        return jsonText({
          type: item.type,
          name: item.name,
          title: item.title,
          description: item.description,
          category: item.category,
          isPro: item.isPro,
          url: `${SITE_URL}${item.href}`,
          install: installCommandFor(item, flavor ?? DEFAULT_REGISTRY_FLAVOR, creds),
          placement: PLACEMENT[item.type],
        });
      }
    );

    server.tool(
      "get_block_source",
      "Get the full .tsx source code for a block, piece, or component. Pro blocks require a valid license (email + license_key) passed on the MCP endpoint URL or as tool arguments; otherwise a LICENSE_REQUIRED error is returned.",
      {
        name: z.string(),
        type: z.enum(["block", "piece", "component"]).optional(),
        flavor: z.enum(["base", "radix"]).optional().describe("Radix or Base UI variant (default: base)"),
        email: z.string().optional(),
        license_key: z.string().optional(),
      },
      async ({ name, type, flavor, email, license_key }) => {
        const item = findItem(name, type as AssetType | undefined);
        if (!item) return jsonText({ error: "not_found", name });
        const resolvedFlavor = flavor ?? DEFAULT_REGISTRY_FLAVOR;
        const stored = licenseCtx.getStore();
        const creds: Creds = {
          email: email ?? stored?.email,
          licenseKey: license_key ?? stored?.licenseKey,
        };

        // Only blocks are gated today (pieces/components are free, mirroring the site).
        if (item.type === "block" && item.isPro) {
          if (!creds.email || !creds.licenseKey) {
            return jsonText({
              code: "LICENSE_REQUIRED",
              message:
                "This is a Pro block. Pass ?email=&license_key= on the MCP endpoint URL (or as tool args) to retrieve its source.",
              upgrade: `${SITE_URL}/pricing`,
            });
          }
          const result = await validateLicenseCredentials(creds.email, creds.licenseKey);
          if (!result.isValid) {
            return jsonText({
              code: "LICENSE_REQUIRED",
              message: result.error ?? "Invalid or expired license.",
              upgrade: `${SITE_URL}/pricing`,
            });
          }
        }

        const source =
          item.type === "block"
            ? await readBlockJsonSource(item, resolvedFlavor)
            : await readItemSource(
                item.type === "piece" ? "registry-pieces" : "registry-components",
                item.name,
                resolvedFlavor
              );

        if (!source) return jsonText({ error: "source_unavailable", name });
        return {
          content: [
            {
              type: "text" as const,
              text: `// ${item.name} (${item.type}, ${resolvedFlavor})\n// Install: ${installCommandFor(item, resolvedFlavor, creds)}\n// Placement: ${PLACEMENT[item.type]}\n\n${source}`,
            },
          ],
        };
      }
    );

    server.tool(
      "list_categories",
      "List all block/piece categories with their titles and descriptions.",
      {},
      async () => {
        const categories = Object.entries(categoryInfoMap)
          .filter(([slug]) => slug !== "all")
          .map(([slug, info]) => ({
            slug,
            title: info.title,
            description: info.description,
            url: `${SITE_URL}/blocks/${slug}`,
          }));
        return jsonText(categories);
      }
    );

    server.tool(
      "install_block",
      "Get the exact shadcn CLI command to install a block, piece, or component into a project.",
      {
        name: z.string(),
        type: z.enum(["block", "piece", "component"]).optional(),
        flavor: z.enum(["base", "radix"]).optional(),
      },
      async ({ name, type, flavor }) => {
        const item = findItem(name, type as AssetType | undefined);
        if (!item) return jsonText({ error: "not_found", name });
        return jsonText({
          name: item.name,
          type: item.type,
          command: installCommandFor(item, flavor ?? DEFAULT_REGISTRY_FLAVOR, licenseCtx.getStore()),
          placement: PLACEMENT[item.type],
        });
      }
    );

    server.tool(
      "compose_page",
      "Given a high-level page intent (e.g. 'AI SaaS landing page'), return an ordered list of blocks that compose a full page, each with its install command.",
      {
        intent: z.string().describe("What page you want to build, e.g. 'developer tool landing page'"),
        limit: z.number().int().min(3).max(12).optional(),
      },
      async ({ intent, limit }) => {
        const results = await hybridSearch(intent, { types: ["block"], limit: limit ?? 8 });
        return jsonText({
          intent,
          blocks: results.map((r) => ({
            name: r.name,
            title: r.title,
            category: r.category,
            isPro: r.isPro,
            url: `${SITE_URL}${r.href}`,
            install: installCommandFor(r, "base"),
          })),
        });
      }
    );
  },
  {
    // Advertised server metadata.
    serverInfo: { name: "beste-ui", version: "1.0.0" },
  },
  {
    basePath: "/api",
    verboseLogs: process.env.NODE_ENV !== "production",
    maxDuration: 60,
  }
);

function withLicense(request: Request): Promise<Response> {
  const url = new URL(request.url);
  return licenseCtx.run(
    {
      email: url.searchParams.get("email") ?? undefined,
      licenseKey: url.searchParams.get("license_key") ?? undefined,
    },
    () => handler(request)
  );
}

export { withLicense as GET, withLicense as POST, withLicense as DELETE };
