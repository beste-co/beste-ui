import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric34",
  title: "Isometric Cooking Pot",
  description:
    "A lidded pot sits on a stove ring glowing in the accent color, and the lid rattles up twice as puffs of steam escape from the sides.",
  category: "Isometric",
  usage: `import { Isometric34 } from "@/components/beste/piece/isometric34";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric34 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Over 500 recipes, each ready in 30 minutes.
  </p>
</div>`,
};
