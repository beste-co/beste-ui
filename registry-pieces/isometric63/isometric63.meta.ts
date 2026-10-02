import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric63",
  title: "Isometric Delivery Truck",
  description:
    "A box truck rolls along an isometric road, the center line sliding past beneath it, and pauses with its back open while a parcel in the accent color hops inside the cargo box before it moves on.",
  category: "Isometric",
  usage: `import { Isometric63 } from "@/components/beste/piece/isometric63";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric63 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Parcels tracked door to door in 48 hours.
  </p>
</div>`,
};
