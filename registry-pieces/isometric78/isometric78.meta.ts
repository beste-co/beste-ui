import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric78",
  title: "Isometric Weather Station",
  description:
    "A puffy cloud drifts above a small gabled house while the sun in the accent color, rays and all, slips behind it and comes back out. Beside the house a thermometer post follows along, its level falling and rising with the sun.",
  category: "Isometric",
  usage: `import { Isometric78 } from "@/components/beste/piece/isometric78";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric78 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Hourly forecasts for 40,000 cities.
  </p>
</div>`,
};
