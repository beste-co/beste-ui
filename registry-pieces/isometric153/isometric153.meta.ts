import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric153",
  title: "Isometric Robot Arm",
  description:
    "An industrial robot arm rides its track, lifts a box in the accent color off a pallet and sets it down on a conveyor, which carries it away before the next box arrives.",
  category: "Isometric",
  usage: `import { Isometric153 } from "@/components/beste/piece/isometric153";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric153 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Automate 12 steps of your line in a day.
  </p>
</div>`,
};
