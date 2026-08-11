import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getBlock } from "@/lib/blocks";
import { isProAuthorized } from "@/lib/entitlements";
import { type RegistryVariant, blockJsonPath } from "@/lib/registry-paths";

export type { RegistryVariant };

/**
 * shadcn URLs are normally written with a `.json` suffix
 * (`shadcn add https://ui.beste.co/r/hero170.json`), and the route segment
 * carries it through. Both spellings address the same item, so the suffix is
 * stripped before anything is looked up. Without this a Pro block requested as
 * `.json` fell through to a 404 instead of the license error.
 */
export function normalizeItemName(name: string): string {
  return name.endsWith(".json") ? name.slice(0, -".json".length) : name;
}

/**
 * Serves a prebuilt block registry-item JSON. Pro blocks require a valid
 * license via URL params (CLI) or session cookie (browser). Behavior is
 * identical for both variants; only the source directories differ.
 */
export async function serveBlockJson(
  request: Request,
  rawName: string,
  variant: RegistryVariant
): Promise<NextResponse> {
  const name = normalizeItemName(rawName);
  const block = getBlock(name);

  if (!block) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  if (block.isPro && !(await isProAuthorized(request))) {
    return NextResponse.json(
      {
        error: "Pro license required",
        message: "This block requires a valid pro license.",
        code: "LICENSE_REQUIRED",
      },
      { status: 403 }
    );
  }

  const jsonPath = blockJsonPath(name, Boolean(block.isPro), variant);

  try {
    const content = await readFile(jsonPath, "utf-8");
    const json = JSON.parse(content);

    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }
}

/**
 * Reads a piece/component source for on-the-fly item JSONs. The base variant
 * comes from the generated registry-base-src/ tree, falling back to the
 * canonical source when the generated tree is absent (e.g. `next dev` before
 * `base:generate` has run — pieces carry no divergent call sites today, so
 * the fallback stays correct).
 */
export async function readItemSource(
  sourceDir: "registry-pieces" | "registry-components",
  name: string,
  variant: RegistryVariant
): Promise<string | null> {
  // Literal directory segments per branch keep Turbopack's dynamic-fs
  // tracing narrow; only `name` stays dynamic.
  const candidates: string[] = [];
  if (sourceDir === "registry-pieces") {
    if (variant === "base") {
      candidates.push(
        path.join(
          process.cwd(),
          "registry-base-src",
          "registry-pieces",
          name,
          `${name}.tsx`
        )
      );
    }
    candidates.push(
      path.join(process.cwd(), "registry-pieces", name, `${name}.tsx`)
    );
  } else {
    if (variant === "base") {
      candidates.push(
        path.join(
          process.cwd(),
          "registry-base-src",
          "registry-components",
          name,
          `${name}.tsx`
        )
      );
    }
    candidates.push(
      path.join(process.cwd(), "registry-components", name, `${name}.tsx`)
    );
  }

  for (const candidate of candidates) {
    try {
      return await readFile(candidate, "utf-8");
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const DEFAULT_ITEM_DEPENDENCIES = ["clsx", "tailwind-merge", "lucide-react"];

/**
 * Shapes the registry-item JSON for a registry-component, shipping the
 * component's own file plus the transitive closure of the components it
 * declares via `registryComponents` (e.g. the product-filters engine ships
 * every filter control it composes). shadcn/ui deps are aggregated across
 * the closure. Returns null when any source in the closure is unreadable.
 */
export async function buildComponentItemJson(options: {
  component: {
    name: string;
    title: string;
    description: string;
    registryDependencies?: string[];
    registryComponents?: string[];
  };
  variant: RegistryVariant;
  resolve: (name: string) => {
    registryDependencies?: string[];
    registryComponents?: string[];
  } | undefined;
}) {
  const { component, variant, resolve } = options;

  const registryDependencies = new Set(component.registryDependencies ?? []);
  const files: Array<{
    path: string;
    content: string;
    type: string;
    target: string;
  }> = [];

  const queue = [component.name];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const name = queue.shift();
    if (!name || seen.has(name)) continue;
    seen.add(name);

    const content = await readItemSource("registry-components", name, variant);
    if (content === null) return null;

    files.push({
      path: `registry-components/${name}/${name}.tsx`,
      content,
      type: "registry:component",
      target: `components/beste/component/${name}.tsx`,
    });

    const meta = name === component.name ? component : resolve(name);
    for (const dep of meta?.registryDependencies ?? []) {
      registryDependencies.add(dep);
    }
    queue.push(...(meta?.registryComponents ?? []));
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: component.name,
    title: component.title,
    description: component.description,
    dependencies: DEFAULT_ITEM_DEPENDENCIES,
    registryDependencies: Array.from(registryDependencies),
    files,
    type: "registry:component",
  };
}

/** Shapes the on-the-fly registry-item JSON served for pieces/components. */
export function buildSingleFileItemJson(options: {
  name: string;
  title: string;
  description: string;
  registryDependencies: string[];
  sourceDir: "registry-pieces" | "registry-components";
  targetDir: "piece" | "component";
  content: string;
}) {
  const { name, sourceDir, targetDir, content } = options;
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: options.name,
    title: options.title,
    description: options.description,
    dependencies: DEFAULT_ITEM_DEPENDENCIES,
    registryDependencies: options.registryDependencies,
    files: [
      {
        path: `${sourceDir}/${name}/${name}.tsx`,
        content,
        type: "registry:component",
        target: `components/beste/${targetDir}/${name}.tsx`,
      },
    ],
    type: "registry:component",
  };
}
