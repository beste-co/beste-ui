import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric118",
  title: "Isometric Recycling Bin",
  description:
    "A bottle tumbles through the round opening of a tapered bin, and the recycling mark on its front, in the accent color, turns one step as it lands. A smaller bin waits beside it.",
  category: "Isometric",
  usage: `import { Isometric118 } from "@/components/beste/piece/isometric118";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric118 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Ship in 100 percent recycled packaging.
  </p>
</div>`,
};
