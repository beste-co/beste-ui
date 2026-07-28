import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card5",
  title: "Article Card",
  description:
    "An article card with cover image, category chip, excerpt, and author row for blog and news grids.",
  category: "Card",
  usage: `import { Card5 } from "@/components/beste/component/card5";

// The whole card becomes a link when href is set.
<Card5
  src="/blog/registry-cover.jpg"
  category="Engineering"
  title="Shipping faster with a component registry"
  excerpt="How we cut landing page build time from days to hours."
  authorName="Selin Aksoy"
  authorSrc="/avatars/selin.jpg"
  date="Jun 12, 2026"
  readTime="6 min read"
  href="/blog/component-registry"
/>

<Card5
  src="/blog/design-tokens.jpg"
  category="Design"
  title="Design tokens that survive a rebrand"
  authorName="Mert Aydin"
  date="May 28, 2026"
  tone="foreground"   // category chip: "primary" (default) | "foreground"
/>`,
};
