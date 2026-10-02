import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric27",
  title: "Isometric Puzzle Cube",
  description:
    "A three by three cube turns like a puzzle cube: the top layer swings a quarter turn, the middle slice rolls over, and the top layer swings back, returning the corner cube in the accent color to its place.",
  category: "Isometric",
  usage: `import { Isometric27 } from "@/components/beste/piece/isometric27";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric27 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    19 services, shipped as 1 app.
  </p>
</div>`,
};
