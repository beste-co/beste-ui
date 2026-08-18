import { SITE_ORIGIN } from "@/lib/site-links";
import { AsyncLocalStorage } from "node:async_hooks";
import { readFile } from "node:fs/promises";
import { blockJsonPath } from "@/lib/registry-paths";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { categoryInfoMap } from "@/lib/category-info";
import {
  COLLECTIONS,
  COLLECTION_BY_BLOCK,
  type CollectionInfo,
  collectionBlockNames,
} from "@/lib/collections";
import {
  DEFAULT_REGISTRY_FLAVOR,
  blockInstallCommand,
  componentInstallCommand,
  pageInstallCommand,
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
  // No type given: prefer block, then piece, then component, then page. Pages
  // come last because their names (landing1, home1) never collide with a
  // block's, so the earlier passes cannot shadow one by accident.
  const order: AssetType[] = ["block", "piece", "component", "page"];
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
  if (item.type === "page") {
    const cmd =
      creds?.email && creds.licenseKey
        ? pageInstallCommand(item.name, { email: creds.email, licenseKey: creds.licenseKey })
        : pageInstallCommand(item.name);
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
  page:
    "WHOLE SCREEN. A page is a finished composition of blocks, navbar to footer. Install it instead of assembling the same screen block by block; do not place one inside another page or alongside sections that repeat its navbar or footer. Every page is Pro.",
};

/**
 * The studio collections, read from lib/collections.ts rather than listed here,
 * so a set added there reaches these tools with no edit to this file.
 */
const COLLECTION_SLUGS = COLLECTIONS.map((c) => c.slug);
const COLLECTION_HINT = `Restrict to one studio collection so every block shares a design language. One of: ${COLLECTION_SLUGS.join(", ")}. Call list_collections for what each one looks like.`;

/**
 * A collection by slug or by label, in any case: an agent asked for "the Sirius
 * collection" passes back whatever the user typed, not the URL segment.
 */
function resolveCollection(input: string): CollectionInfo | undefined {
  const q = input.trim().toLowerCase();
  return COLLECTIONS.find((c) => c.slug === q || c.label.toLowerCase() === q);
}

/** Every block in a collection, in catalogue order. */
function collectionItems(slug: string): IndexItem[] {
  const names = collectionBlockNames(slug);
  const { items } = loadIndex();
  return items.filter((i) => i.type === "block" && names.has(i.name));
}

const unknownCollection = (slug: string) =>
  jsonText({ error: "unknown_collection", collection: slug, available: COLLECTION_SLUGS });

/** Collections hold blocks only, so a non-block can never be a member. */
function inCollection(item: { type: AssetType; name: string }, names: ReadonlySet<string>): boolean {
  return item.type === "block" && names.has(item.name);
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "search_blocks",
      {
        description: "Search Beste UI's catalog by natural language. Returns ranked matches with name, title, category, Pro status, page URL, and a `placement` rule. Asset types differ in how they may be used: a `block` is a full page section; a `piece` is an ASSET that only belongs inside a block's media slot (never a standalone section, never an interactive/fillable control); a `component` is a design-system primitive composed inside sections; a `page` is a finished screen composed of blocks, navbar to footer. Always honor each result's `placement` field — do not render a piece as a section or interactive element. Pass `collection` to keep every result inside one studio set.",
        inputSchema: z.object({
          query: z.string().describe("Natural-language description of the UI you want, e.g. 'pricing table with monthly/yearly toggle'"),
          type: z.enum(["block", "piece", "component", "page", "all"]).optional().describe("Restrict to one asset type (default: all)"),
          category: z.string().optional().describe("Optional category filter, e.g. 'Hero', 'Pricing'"),
          collection: z.string().optional().describe(COLLECTION_HINT),
          limit: z.number().int().min(1).max(30).optional(),
        }),
      },
      async ({ query, type, category, collection, limit }) => {
        const set = collection ? resolveCollection(collection) : undefined;
        if (collection && !set) return unknownCollection(collection);
        const types =
          type && type !== "all" ? [type as AssetType] : undefined;
        const want = limit ?? 12;
        // Collection and category are applied after ranking, so ask the index
        // for a wider slice first or the filter eats the whole page of results.
        let results = await hybridSearch(query, {
          types,
          limit: set || category ? want * 10 : want,
        });
        if (set) {
          const names = collectionBlockNames(set.slug);
          results = results.filter((r) => inCollection(r, names));
        }
        if (category) {
          const c = category.toLowerCase();
          results = results.filter((r) => r.category.toLowerCase() === c);
        }
        return jsonText(
          results.slice(0, want).map((r) => ({
            type: r.type,
            name: r.name,
            title: r.title,
            category: r.category,
            isPro: r.isPro,
            collection: COLLECTION_BY_BLOCK.get(r.name) ?? null,
            url: `${SITE_URL}${r.href}`,
            placement: PLACEMENT[r.type],
          }))
        );
      }
    );

    server.registerTool(
      "get_block",
      {
        description: "Get metadata for a single block, piece, component, or page: title, description, category, Pro status, preview URL, install command, and a `placement` rule. Note the `placement`: a `piece` is asset-only (media slots inside a block, never a standalone section or interactive control); a `component` is a primitive composed inside sections; a `block` is a full section.",
        inputSchema: z.object({
          name: z.string(),
          type: z.enum(["block", "piece", "component", "page"]).optional(),
          flavor: z.enum(["base", "radix"]).optional().describe("Registry flavor for the install command (default: base)"),
        }),
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
          collection: COLLECTION_BY_BLOCK.get(item.name) ?? null,
          url: `${SITE_URL}${item.href}`,
          install: installCommandFor(item, flavor ?? DEFAULT_REGISTRY_FLAVOR, creds),
          placement: PLACEMENT[item.type],
        });
      }
    );

    server.registerTool(
      "get_block_source",
      {
        description: "Get the full .tsx source code for a block, piece, or component. Pro blocks require a valid license (email + license_key) passed on the MCP endpoint URL or as tool arguments; otherwise a LICENSE_REQUIRED error is returned.",
        inputSchema: z.object({
          name: z.string(),
          type: z.enum(["block", "piece", "component"]).optional(),
          flavor: z.enum(["base", "radix"]).optional().describe("Radix or Base UI variant (default: base)"),
          email: z.string().optional(),
          license_key: z.string().optional(),
        }),
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

    server.registerTool(
      "list_categories",
      {
        description: "List all block/piece categories with their titles and descriptions.",
      },
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

    server.registerTool(
      "list_collections",
      {
        description:
          "List the studio collections: named sets of blocks that share one design language (type scale, buttons, spacing, colour). Composing a page from a single collection is what makes it look designed rather than assembled. Pass a slug as the `collection` argument of search_blocks or compose_page.",
      },
      async () => {
        return jsonText(
          COLLECTIONS.map((c) => ({
            slug: c.slug,
            label: c.label,
            description: c.description,
            blocks: c.count,
            url: `${SITE_URL}/blocks/collection/${c.slug}`,
          }))
        );
      }
    );

    server.registerTool(
      "install_block",
      {
        description: "Get the exact shadcn CLI command to install a block, piece, component, or page into a project. Installing a page installs every block it is composed of.",
        inputSchema: z.object({
          name: z.string(),
          type: z.enum(["block", "piece", "component", "page"]).optional(),
          flavor: z.enum(["base", "radix"]).optional(),
        }),
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

    server.registerTool(
      "compose_page",
      {
        description: "Given a high-level page intent (e.g. 'AI SaaS landing page'), return an ordered list of blocks that compose a full page, each with its install command. Pass `collection` to build the page out of one studio set, so every section shares a design language.",
        inputSchema: z.object({
          intent: z.string().describe("What page you want to build, e.g. 'developer tool landing page'"),
          collection: z.string().optional().describe(COLLECTION_HINT),
          limit: z.number().int().min(3).max(12).optional(),
        }),
      },
      async ({ intent, collection, limit }) => {
        const set = collection ? resolveCollection(collection) : undefined;
        if (collection && !set) return unknownCollection(collection);
        const want = limit ?? 8;
        const results = await hybridSearch(intent, {
          types: ["block"],
          limit: set ? want * 10 : want,
        });

        let picked: IndexItem[] = results;
        if (set) {
          const names = collectionBlockNames(set.slug);
          picked = results.filter((r) => inCollection(r, names));
          // Ranking inside one set can run dry before the page is full, and a
          // three-section landing page is not what was asked for. Top up from
          // the rest of the collection so the composition always has its parts.
          if (picked.length < want) {
            const seen = new Set(picked.map((p) => p.name));
            for (const item of collectionItems(set.slug)) {
              if (picked.length >= want) break;
              if (seen.has(item.name)) continue;
              picked.push(item);
            }
          }
        }

        return jsonText({
          intent,
          collection: set?.slug ?? null,
          blocks: picked.slice(0, want).map((r) => ({
            name: r.name,
            title: r.title,
            category: r.category,
            isPro: r.isPro,
            collection: COLLECTION_BY_BLOCK.get(r.name) ?? null,
            url: `${SITE_URL}${r.href}`,
            install: installCommandFor(r, "base"),
          })),
        });
      }
    );
  },
  {
    // Advertised server metadata. mcp-handler v2 takes one options object and
    // serves whatever route it is mounted at, so the old `basePath` is gone;
    // `maxDuration` is the route segment export above.
    serverInfo: { name: "beste-ui", version: "1.0.0" },
    verboseLogs: process.env.NODE_ENV !== "production",
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
