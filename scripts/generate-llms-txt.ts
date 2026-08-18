import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { categoryInfoMap } from "../lib/category-info";
import { getPopulatedCategories, getToolsByCategory, tools } from "../lib/tools";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
}

interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

const SITE_URL = "https://ui.beste.co";

const BESTE_INFO = `## About beste.co

Beste is the site builder with strong constraints. No drag and drop, no inline chaos, no code. Just structured blocks designed to work together.

- **Website**: [beste.co](https://beste.co)
- **Philosophy**: Opinionated, block-based website building
- **Approach**: Pre-designed blocks that compose into complete pages
`;

/**
 * The free tools at /tools, grouped by their category hub. Empty in the
 * open-source build, which stubs the registry because it does not carry the
 * routes, so the whole section drops out rather than printing a bare heading.
 */
function renderToolsBlock(heading: string, intro: string, withDescriptions: boolean): string {
  if (tools.length === 0) return "";

  const sections = getPopulatedCategories()
    .map((category) => {
      const items = getToolsByCategory(category.id)
        .map((tool) =>
          withDescriptions
            ? `- [${tool.title}](${SITE_URL}/tools/${tool.slug}): ${tool.description}`
            : `- [${tool.title}](${SITE_URL}/tools/${tool.slug})`
        )
        .join("\n");
      return `### ${category.title}\n\n${items}`;
    })
    .join("\n\n");

  return `## ${heading}\n\n${intro}\n\n${sections}\n\n`;
}


/**
 * The three tiers that live outside registry.json.
 *
 * registry.json is the shadcn block registry and carries blocks alone, so for
 * years llms.txt described 1935 blocks and nothing else: the 989 pieces, the
 * components and the whole Pages tier were invisible to anything reading it.
 * Their metadata is read straight off disk, the way the sitemap generator does
 * it, rather than by importing the generated barrels, which pull ~3000 React
 * components into a script that only wants four strings from each.
 */
interface TierItem {
  name: string;
  title: string;
  description: string;
  category: string;
}

function collectTier(registryDir: string): TierItem[] {
  const dir = join(import.meta.dirname, "..", registryDir);
  if (!existsSync(dir)) return [];

  const items: TierItem[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const metaPath = join(dir, entry.name, `${entry.name}.meta.ts`);
    if (!existsSync(metaPath)) continue;

    const source = readFileSync(metaPath, "utf-8");
    const name = source.match(/name:\s*["']([^"']+)["']/)?.[1];
    const title = source.match(/title:\s*["']([^"']+)["']/)?.[1];
    // Descriptions routinely wrap onto their own line and run long, so the
    // match spans newlines and tolerates escaped quotes inside the string.
    const description = source
      .match(/description:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1]
      ?.replace(/\\"/g, '"');
    const category = source.match(/category:\s*["']([^"']+)["']/)?.[1];
    // `hidden: true` marks an engine that other items depend on but that no
    // showcase surface lists (product-filters). Advertising it here would
    // point agents at something with no page behind it.
    if (/hidden:\s*true/.test(source)) continue;

    if (name && title && description && category) {
      items.push({ name, title, description, category });
    }
  }
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

function groupByCategory(items: TierItem[]): Record<string, TierItem[]> {
  const grouped: Record<string, TierItem[]> = {};
  for (const item of items) {
    (grouped[item.category] ??= []).push(item);
  }
  return grouped;
}

/** One tier as a compact linked list, grouped under its categories. */
function renderTier(
  heading: string,
  intro: string,
  items: TierItem[],
  detailPath: string
): string {
  if (items.length === 0) return "";

  const sections = Object.entries(groupByCategory(items))
    .map(
      ([category, tierItems]) =>
        `### ${category}\n\n${tierItems
          .map(
            (item) =>
              `- [${item.title}](${SITE_URL}/${detailPath}/${item.name}): ${item.description}`
          )
          .join("\n")}`
    )
    .join("\n\n");

  return `## ${heading}\n\n${intro}\n\n${sections}\n\n`;
}

/** The same tier for llms-full.txt: one entry each, with its install command. */
function renderTierFull(
  heading: string,
  intro: string,
  items: TierItem[],
  detailPath: string,
  registryPath: string
): string {
  if (items.length === 0) return "";

  const sections = Object.entries(groupByCategory(items))
    .map(
      ([category, tierItems]) =>
        `### ${category}\n\n${tierItems
          .map(
            (item) =>
              `#### ${item.title}\n\n- **URL**: ${SITE_URL}/${detailPath}/${item.name}\n- **Install**: \`npx shadcn add ${SITE_URL}/${registryPath}/${item.name}\`\n- **Description**: ${item.description}`
          )
          .join("\n\n")}`
    )
    .join("\n\n");

  return `## ${heading}\n\n${intro}\n\n${sections}\n\n`;
}

function generateLlmsTxt() {
  const registryPath = join(import.meta.dirname, "..", "registry.json");
  const registry: Registry = JSON.parse(readFileSync(registryPath, "utf-8"));

  const pieces = collectTier("registry-pieces");
  const uiComponents = collectTier("registry-components");
  const pages = collectTier("registry-pages");

  // Group components by category
  const categories: Record<string, RegistryItem[]> = {};

  // Map component prefix to category slug (for cases where they differ)
  const prefixToSlug: Record<string, string> = {
    usecase: "use-case",
    comingsoon: "coming-soon",
    navbar: "navigation",
  };

  for (const item of registry.items) {
    // Extract category from name (e.g., "feature22" -> "Feature", "hero7" -> "Hero")
    const match = item.name.match(/^([a-z]+)(\d+)$/);
    if (match) {
      const prefix = match[1] as string;
      const slug = prefixToSlug[prefix] || prefix;
      const category = categoryInfoMap[slug]?.title || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    }
  }

  // Generate llms.txt (concise navigation)
  const llmsTxt = `# ${registry.name}

> A modern React component library built on shadcn/ui. Copy and paste beautiful, accessible UI blocks into your Next.js and React projects. Production-ready and free to start.

${BESTE_INFO}
## About ${registry.name}

${
  registry.name
} provides production-ready UI blocks that you can install directly using the shadcn CLI. Each component is built with React, Tailwind CSS, and follows accessibility best practices.

## Documentation

- [Homepage](${SITE_URL}/blocks): Browse all available components
- [Installation](${SITE_URL}/docs/installation): How to install components using shadcn CLI
- [MCP server](${SITE_URL}/docs/mcp): Connect an agent to this catalog at ${SITE_URL}/api/mcp. Search, preview, compose a page and install, over Streamable HTTP.
- [Markdown](${SITE_URL}/index.md): Every page on this site is available as Markdown. Add \`.md\` to any address, or send an \`Accept: text/markdown\` header.

## Components

${Object.entries(categories)
  .map(
    ([category, items]) =>
      `### ${category}\n\n${items
        .map(
          (item) =>
            `- [${item.title}](${SITE_URL}/block/${item.name}): ${item.description}`
        )
        .join("\n")}`
  )
  .join("\n\n")}

${renderTier(
  "Pages",
  `Whole pages composed from the blocks, at ${SITE_URL}/pages. Installing one installs every block it is made of.`,
  pages,
  "page"
)}${renderTier(
  "Pieces",
  `Small composable widgets at ${SITE_URL}/pieces. They drop into the media slots inside a block. Free, no license needed.`,
  pieces,
  "piece"
)}${renderTier(
  "Components",
  `The primitives every block is built from, at ${SITE_URL}/components. Free, no license needed.`,
  uiComponents,
  "component"
)}${renderToolsBlock(
  "Free tools",
  `Browser-based developer tools at ${SITE_URL}/tools. No signup, nothing uploaded.`,
  false
)}## Optional

- [GitHub](https://github.com/beste-co/beste-ui): Source code and contributions
`;

  // Generate llms-full.txt (comprehensive)
  const llmsFullTxt = `# ${registry.name}

> A modern React component library built on shadcn/ui. Copy and paste beautiful, accessible UI blocks into your Next.js and React projects. Production-ready and free to start.

${BESTE_INFO}
## About ${registry.name}

${registry.name} is a curated collection of ${
    registry.items.length
  } production-ready UI components designed for modern web applications. Built on top of shadcn/ui, each component combines the power of:

- **React 19** - Latest React features and patterns
- **Tailwind CSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **TypeScript** - Full type safety

## Installation

Components can be installed using the shadcn CLI. The default \`/r-base/\`
URLs serve Base UI variants (shadcn's current default primitive library);
projects still on Radix-based shadcn should use the \`/r/\` URLs instead.

\`\`\`bash
# Base UI (default)
npx shadcn@latest add "${SITE_URL}/r-base/{component-name}.json"

# Radix
npx shadcn@latest add "${SITE_URL}/r/{component-name}.json"
\`\`\`

For example, to install the hero7 component:

\`\`\`bash
npx shadcn@latest add "${SITE_URL}/r-base/hero7.json"
\`\`\`

## Component Reference

${Object.entries(categories)
  .map(
    ([category, items]) =>
      `### ${category}

${items
  .map(
    (item) =>
      `#### ${item.title}

- **URL**: ${SITE_URL}/block/${item.name}
- **Install**: \`npx shadcn@latest add "${SITE_URL}/r-base/${item.name}.json"\` (Radix: \`/r/${item.name}.json\`)
- **Description**: ${item.description}`
  )
  .join("\n\n")}`
  )
  .join("\n\n")}

${renderTierFull(
  "Pages",
  "Whole pages composed from the blocks. Installing a page installs every block inside it. Pro.",
  pages,
  "page",
  "page/r"
)}${renderTierFull(
  "Pieces",
  "Small composable widgets that drop into the media slots inside a block. Free, no license needed.",
  pieces,
  "piece",
  "piece/r"
)}${renderTierFull(
  "Components",
  "The primitives every block is built from. Free, no license needed.",
  uiComponents,
  "component",
  "component/r"
)}${renderToolsBlock(
  "Free Tools",
  "Every tool runs in the browser, is free and needs no account.",
  true
)}## Links

- [Homepage](${SITE_URL})
- [GitHub](https://github.com/beste-co/beste-ui)
- [Twitter/X](https://x.com/withbeste)
`;

  const outputDir = join(import.meta.dirname, "..", "public");

  writeFileSync(join(outputDir, "llms.txt"), llmsTxt, "utf-8");
  writeFileSync(join(outputDir, "llms-full.txt"), llmsFullTxt, "utf-8");

  console.log(
    `Generated llms.txt and llms-full.txt with ${registry.items.length} blocks, ` +
      `${pages.length} pages, ${pieces.length} pieces, ${uiComponents.length} components ` +
      `and ${tools.length} tools`
  );
}

generateLlmsTxt();
