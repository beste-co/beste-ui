import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric147",
  title: "Isometric Fuel Pump",
  description:
    "A fuel pump stands on its island with the hose running to a parked car's tank. The counter in the accent color ticks up through the readings, then starts again.",
  category: "Isometric",
  usage: `import { Isometric147 } from "@/components/beste/piece/isometric147";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric147 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Fuel prices from 8,000 stations, updated hourly.
  </p>
</div>`,
};
