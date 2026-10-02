import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric114",
  title: "Isometric Delivery Scooter",
  description:
    "A delivery scooter seen from the side rides in place along a road, its wheels turning while the lane markings slide past. The box in the accent color sits on the rear rack behind the seat.",
  category: "Isometric",
  usage: `import { Isometric114 } from "@/components/beste/piece/isometric114";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric114 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Hot meals at the door in 25 minutes.
  </p>
</div>`,
};
