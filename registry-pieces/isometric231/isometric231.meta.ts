import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric231",
  title: "Isometric Technical SEO",
  description:
    "A checklist stands on a desk stand with three rows for the sitemap, the canonical address and structured data. A check draws itself into each row in turn in the accent color, while a small sitemap tree of tiles sits on the desk beside it.",
  category: "Isometric",
  usage: `import { Isometric231 } from "@/components/beste/piece/isometric231";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric231 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    The technical parts, already done.
  </p>
</div>`,
};
