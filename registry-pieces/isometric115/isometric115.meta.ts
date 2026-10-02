import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric115",
  title: "Isometric Ambulance",
  description:
    "An ambulance van with a cross and a stripe along its side races down the road, the lane markings sliding past beneath it, while the light bar on its roof in the accent color flashes left and right.",
  category: "Isometric",
  usage: `import { Isometric115 } from "@/components/beste/piece/isometric115";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric115 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Urgent care on call around the clock, 7 days a week.
  </p>
</div>`,
};
