import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { categoryInfoMap } from "../lib/category-info";

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

function generateLlmsTxt() {
  const registryPath = join(import.meta.dirname, "..", "registry.json");
  const registry: Registry = JSON.parse(readFileSync(registryPath, "utf-8"));

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

## Optional

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

## Links

- [Homepage](${SITE_URL})
- [GitHub](https://github.com/beste-co/beste-ui)
- [Twitter/X](https://x.com/withbeste)
`;

  const outputDir = join(import.meta.dirname, "..", "public");

  writeFileSync(join(outputDir, "llms.txt"), llmsTxt, "utf-8");
  writeFileSync(join(outputDir, "llms-full.txt"), llmsFullTxt, "utf-8");

  console.log(
    `Generated llms.txt and llms-full.txt with ${registry.items.length} components`
  );
}

generateLlmsTxt();
