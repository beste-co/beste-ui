import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric135",
  title: "Isometric Perfume Bottle",
  description:
    "A faceted perfume bottle in the accent color stands on a round tray under a tall cap. The atomizer presses down and a soft mist drifts out and fades.",
  category: "Isometric",
  usage: `import { Isometric135 } from "@/components/beste/piece/isometric135";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric135 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Find your signature scent in 3 samples.
  </p>
</div>`,
};
