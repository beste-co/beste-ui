import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric102",
  title: "Isometric Ice Cream Cart",
  description:
    "A small ice cream cart stands on one big wheel with a waffle cone and a scoop on its counter. Above it the umbrella, striped in the accent color, turns slowly around its pole.",
  category: "Isometric",
  usage: `import { Isometric102 } from "@/components/beste/piece/isometric102";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric102 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Summer menu live in 3 locations.
  </p>
</div>`,
};
