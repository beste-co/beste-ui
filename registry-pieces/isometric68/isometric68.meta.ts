import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric68",
  title: "Isometric Traffic Light",
  description:
    "A traffic light stands on the corner of an isometric crossing with zebra stripes, cycling from green at the bottom through yellow to red at the top and back.",
  category: "Isometric",
  usage: `import { Isometric68 } from "@/components/beste/piece/isometric68";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric68 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Live traffic data from 1,200 intersections.
  </p>
</div>`,
};
