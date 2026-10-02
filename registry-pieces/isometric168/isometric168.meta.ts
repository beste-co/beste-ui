import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric168",
  title: "Isometric Forklift",
  description:
    "A forklift raises a pallet up its mast with a box in the accent color riding on the forks, holds it at height and lowers it back to the floor.",
  category: "Isometric",
  usage: `import { Isometric168 } from "@/components/beste/piece/isometric168";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric168 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every pallet tracked from dock to shelf.
  </p>
</div>`,
};
