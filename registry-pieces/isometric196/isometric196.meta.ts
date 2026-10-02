import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric196",
  title: "Isometric Mobile Game",
  description:
    "A phone propped on its long edge runs a side scroller: the ground and its blocks slide past while the ball in the accent color jumps each one, the jump button presses in time and the stick drifts under the thumb.",
  category: "Isometric",
  usage: `import { Isometric196 } from "@/components/beste/piece/isometric196";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric196 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Play anywhere, pick up where you left off.
  </p>
</div>`,
};
