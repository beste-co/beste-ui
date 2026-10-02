import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric17",
  title: "Isometric Build Pipeline",
  description:
    "Blocks ride an isometric conveyor belt through a gate and come out tinted in the accent color, like builds moving through a CI pipeline.",
  category: "Isometric",
  usage: `import { Isometric17 } from "@/components/beste/piece/isometric17";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric17 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every commit tested and shipped in 4 minutes.
  </p>
</div>`,
};
