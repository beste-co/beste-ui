/**
 * Generates lib/blocks.ts and registry.json from component .meta.ts files.
 *
 * This script scans the registry/ directory for all components,
 * reads their .meta.ts files, and generates the centralized files.
 *
 * Usage: bun run scripts/generate-blocks.ts
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BlockMeta } from "../lib/block-types";
import type { ComponentMeta } from "../lib/component-types";

const REGISTRY_DIR = join(import.meta.dirname, "..", "registry");
const COMPONENTS_DIR = join(import.meta.dirname, "..", "registry-pieces");
const UI_COMPONENTS_DIR = join(
  import.meta.dirname,
  "..",
  "registry-components"
);
const OUTPUT_BLOCKS = join(import.meta.dirname, "..", "lib", "blocks.ts");
const OUTPUT_REGISTRY = join(import.meta.dirname, "..", "registry.json");

const DEFAULT_DEPENDENCIES = ["clsx", "tailwind-merge", "lucide-react"];

interface CollectedMeta extends BlockMeta {
  componentDir: string;
  componentName: string;
}

/**
 * Extract the exported component name from a .tsx file.
 * Looks for "export function ComponentName" or "export const ComponentName".
 */
function extractComponentName(filePath: string): string | undefined {
  const content = readFileSync(filePath, "utf-8");
  // Match: export function ComponentName or export const ComponentName
  const match = content.match(
    /export\s+(?:function|const)\s+([A-Z][a-zA-Z0-9]+)(?:\s*[(:=])/
  );
  return match?.[1];
}

/** Import meta files concurrently in batches to avoid fd exhaustion. */
const META_BATCH = 64;

/**
 * Write a file only when its content differs, to preserve mtimes (and thus
 * downstream incremental caches) when the generated output is unchanged.
 */
function writeIfChanged(path: string, content: string): boolean {
  if (existsSync(path) && readFileSync(path, "utf-8") === content) return false;
  writeFileSync(path, content, "utf-8");
  return true;
}

/**
 * Dynamically import all .meta.ts files from registry directories.
 * Imports run in parallel batches; results stay in sorted-dir order.
 */
async function collectMetadata(): Promise<CollectedMeta[]> {
  const dirs = readdirSync(REGISTRY_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  const results: (CollectedMeta | null)[] = new Array(dirs.length).fill(null);

  for (let start = 0; start < dirs.length; start += META_BATCH) {
    const batch = dirs.slice(start, start + META_BATCH);
    await Promise.all(
      batch.map(async (dir, offset) => {
        const index = start + offset;
        const metaPath = join(REGISTRY_DIR, dir, `${dir}.meta.ts`);
        const componentPath = join(REGISTRY_DIR, dir, `${dir}.tsx`);

        if (!existsSync(metaPath)) {
          console.warn(`Warning: No .meta.ts file found for ${dir}`);
          return;
        }

        try {
          const module = await import(metaPath);
          const meta: BlockMeta = module.meta;

          if (!meta) {
            console.warn(`Warning: No 'meta' export found in ${dir}.meta.ts`);
            return;
          }

          let componentName = meta.componentName;
          if (!componentName && existsSync(componentPath)) {
            componentName = extractComponentName(componentPath);
          }
          if (!componentName) {
            componentName = capitalize(dir);
          }

          results[index] = { ...meta, componentDir: dir, componentName };
        } catch (error) {
          console.error(`Error importing ${dir}.meta.ts:`, error);
        }
      })
    );
  }

  return results.filter((m): m is CollectedMeta => m !== null);
}

/**
 * Generate lib/blocks.ts content.
 */
function generateBlocksTs(metas: CollectedMeta[]): string {
  // Generate imports
  const imports = metas
    .map((m) => {
      return `import { ${m.componentName}, ${m.name}Demo } from "@/registry/${m.componentDir}/${m.componentDir}";`;
    })
    .join("\n");

  // Generate _blocks array entries, chunked to avoid TypeScript union type limit
  const CHUNK_SIZE = 250;
  const entryObjects = metas.map((m) => {
    const props = [
      `    name: "${m.name}"`,
      `    title: "${m.title}"`,
      `    description: "${escapeString(m.description)}"`,
      `    category: "${m.category}"`,
      `    component: ${m.componentName}`,
      `    demoProps: ${m.name}Demo`,
    ];

    if (m.fullscreen) props.push(`    fullscreen: true`);
    if (m.previewAlign) props.push(`    previewAlign: "${m.previewAlign}"`);
    if (m.isPro) props.push(`    isPro: true`);
    if (m.tags?.length) {
      props.push(`    tags: [${m.tags.map((t) => `"${escapeString(t)}"`).join(", ")}]`);
    }

    return `  {\n${props.join(",\n")},\n  }`;
  });

  const chunks: string[][] = [];
  for (let i = 0; i < entryObjects.length; i += CHUNK_SIZE) {
    chunks.push(entryObjects.slice(i, i + CHUNK_SIZE));
  }

  const chunkDeclarations = chunks
    .map(
      (chunk, i) =>
        `const _blocks_${i}: BlockMeta[] = [\n${chunk.join(",\n")}\n];`
    )
    .join("\n\n");

  const chunkSpreads = chunks.map((_, i) => `..._blocks_${i}`).join(", ");

  return `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated by: bun run scripts/generate-blocks.ts
// Source: registry/{name}/{name}.meta.ts files

import type { ComponentType } from "react";

${imports}

export interface BlockMeta {
  name: string;
  title: string;
  description: string;
  category: string;
  component: ComponentType<any>;
  demoProps: any;
  /** If true, the block will be rendered in an iframe for proper fullscreen display */
  fullscreen?: boolean;
  /** Preview alignment for mobile cards: 'top' (default) or 'bottom' */
  previewAlign?: "top" | "bottom";
  /** If true, the block is a Pro block with obfuscated source code */
  isPro?: boolean;
  /** Cross-category hub labels, surfaced at /blocks/tag/{slug} */
  tags?: string[];
}

${chunkDeclarations}

const _blocks: BlockMeta[] = [${chunkSpreads}];

export const blocks = _blocks;

export function getBlock(name: string): BlockMeta | undefined {
  return blocks.find((block) => block.name === name);
}
`;
}

/**
 * Read a registry-component's .meta.ts to discover its own registryDependencies.
 * Returns undefined if the component dir or meta file is missing — the caller
 * surfaces that as a build error.
 */
async function loadComponentMeta(
  name: string
): Promise<ComponentMeta | undefined> {
  const metaPath = join(COMPONENTS_DIR, name, `${name}.meta.ts`);
  if (!existsSync(metaPath)) return undefined;
  const module = await import(metaPath);
  return module.meta as ComponentMeta | undefined;
}

/**
 * Read a registry-component's .meta.ts (from registry-components/) to discover
 * its own registryDependencies. Returns undefined if the meta file is missing.
 */
async function loadRegistryComponentMeta(
  name: string
): Promise<ComponentMeta | undefined> {
  const metaPath = join(UI_COMPONENTS_DIR, name, `${name}.meta.ts`);
  if (!existsSync(metaPath)) return undefined;
  const module = await import(metaPath);
  return module.meta as ComponentMeta | undefined;
}

/**
 * Generate registry.json content.
 */
async function generateRegistryJson(metas: CollectedMeta[]): Promise<string> {
  const items = await Promise.all(
    metas.map(async (m) => {
      const files: Array<{ path: string; type: string; target: string }> = [
        {
          path: `registry/${m.componentDir}/${m.componentDir}.tsx`,
          type: "registry:component",
          target: `components/beste/block/${m.componentDir}.tsx`,
        },
      ];

      const aggregatedDeps = new Set(m.registryDependencies ?? []);

      for (const componentName of m.componentDependencies ?? []) {
        const componentDir = join(COMPONENTS_DIR, componentName);
        const componentFile = join(componentDir, `${componentName}.tsx`);
        if (!existsSync(componentFile)) {
          throw new Error(
            `Block ${m.name} declares componentDependencies: ["${componentName}"] but registry-pieces/${componentName}/${componentName}.tsx does not exist`
          );
        }

        files.push({
          path: `registry-pieces/${componentName}/${componentName}.tsx`,
          type: "registry:component",
          target: `components/beste/piece/${componentName}.tsx`,
        });

        const componentMeta = await loadComponentMeta(componentName);
        for (const dep of componentMeta?.registryDependencies ?? []) {
          aggregatedDeps.add(dep);
        }
      }

      // Walk registryComponents transitively: a registry-component may itself
      // declare registryComponents (e.g. the product-filters engine composes
      // the individual filter controls), and every file in the closure must
      // ship with the block for a single `shadcn add` to work.
      const componentQueue = [...(m.registryComponents ?? [])];
      const seenComponents = new Set<string>();
      while (componentQueue.length > 0) {
        const componentName = componentQueue.shift();
        if (!componentName || seenComponents.has(componentName)) continue;
        seenComponents.add(componentName);

        const componentDir = join(UI_COMPONENTS_DIR, componentName);
        const componentFile = join(componentDir, `${componentName}.tsx`);
        if (!existsSync(componentFile)) {
          throw new Error(
            `Block ${m.name} needs registry-component "${componentName}" but registry-components/${componentName}/${componentName}.tsx does not exist`
          );
        }

        files.push({
          path: `registry-components/${componentName}/${componentName}.tsx`,
          type: "registry:component",
          target: `components/beste/component/${componentName}.tsx`,
        });

        const componentMeta =
          await loadRegistryComponentMeta(componentName);
        for (const dep of componentMeta?.registryDependencies ?? []) {
          aggregatedDeps.add(dep);
        }
        componentQueue.push(...(componentMeta?.registryComponents ?? []));
      }

      return {
        name: m.name,
        type: "registry:block",
        title: m.title,
        description: m.description,
        dependencies: m.dependencies?.length
          ? m.dependencies
          : DEFAULT_DEPENDENCIES,
        registryDependencies: Array.from(aggregatedDeps),
        files,
      };
    })
  );

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "beste-ui",
    homepage: "https://ui.beste.co",
    items,
  };

  return JSON.stringify(registry, null, 2);
}

/**
 * Capitalize first letter of component name (e.g., "feature22" -> "Feature22").
 */
function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Escape string for use in generated code.
 */
function escapeString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function main() {
  console.log("Collecting metadata from registry/*/*.meta.ts...");
  const metas = await collectMetadata();

  if (metas.length === 0) {
    console.error("No metadata files found. Run migration first.");
    process.exit(1);
  }

  console.log(`Found ${metas.length} components`);

  // Generate blocks.ts
  console.log("Generating lib/blocks.ts...");
  const blocksContent = generateBlocksTs(metas);
  writeIfChanged(OUTPUT_BLOCKS, blocksContent);

  // Generate registry.json
  console.log("Generating registry.json...");
  const registryContent = await generateRegistryJson(metas);
  writeIfChanged(OUTPUT_REGISTRY, registryContent);

  console.log("Done! Generated:");
  console.log(`  - lib/blocks.ts (${metas.length} components)`);
  console.log(`  - registry.json (${metas.length} items)`);
}

main().catch(console.error);
