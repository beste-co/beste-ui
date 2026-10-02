import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric48",
  title: "Isometric Abacus",
  description:
    "A wooden abacus stands on a small plinth with five rods of chunky beads. On each rod one bead in the accent color slides across the free stretch, taps the next bead, and later slides back, one rod after another.",
  category: "Isometric",
  usage: `import { Isometric48 } from "@/components/beste/piece/isometric48";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric48 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Math that clicks, one bead at a time.
  </p>
</div>`,
};
