import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric123",
  title: "Isometric Baby Stroller",
  description:
    "A classic pram with a rounded body, a curved push handle and a ribbed folding hood in the accent color. The body rocks gently on its springs while the four spoked wheels stay planted.",
  category: "Isometric",
  usage: `import { Isometric123 } from "@/components/beste/piece/isometric123";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric123 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Track 1 baby's naps, feeds and firsts.
  </p>
</div>`,
};
