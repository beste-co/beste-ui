import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "snippet-install",
  title: "Snippet Install",
  description:
    "An install command block with a tab for each package manager: npm, pnpm, yarn and bun, or any subset in any order. The command is derived from the packages, a dev flag and whether they are installed or run once (npx, pnpm dlx, yarn dlx, bunx), or given exactly per manager. A marker slides between the tabs on a spring, and the reader's pick is remembered and shared by every snippet on the page and across visits. The copy button morphs into a check and announces itself, and a long command scrolls sideways instead of wrapping.",
  category: "Snippet",
  usage: `import { SnippetInstall } from "@/components/beste/component/snippet-install";

// Installs, with the command written for each manager
<SnippetInstall packages={["motion", "lucide-react"]} />

// A dev dependency
<SnippetInstall packages="@biomejs/biome" dev />

// Run once without installing: npx, pnpm dlx, yarn dlx, bunx
<SnippetInstall kind="exec" packages="shadcn@latest add button" />

// Exact commands where the derived ones do not fit
<SnippetInstall
  managers={["pnpm", "bun"]}
  commands={{ pnpm: "pnpm create next-app@latest", bun: "bun create next-app" }}
/>

<SnippetInstall
  packages="zod"
  defaultManager="pnpm"   // shown until the reader picks
  remember={false}        // keep this snippet's pick to itself
  prompt={false}          // no $ before the command
  tone="outline"          // "muted" (default) | "outline" | "ghost"
  size="sm"               // "sm" | "default" | "lg"
  onCopy={(command) => console.log("Copied", command)}
/>`,
};
