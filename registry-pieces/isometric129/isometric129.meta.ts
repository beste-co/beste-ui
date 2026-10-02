import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric129",
  title: "Isometric Paint Roller",
  description:
    "A paint roller rolls up a wall and lays fresh paint in the accent color beside an area already painted, while a paint tray waits on the floor below.",
  category: "Isometric",
  usage: `import { Isometric129 } from "@/components/beste/piece/isometric129";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric129 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Repaint a room in 1 day, walls and trim.
  </p>
</div>`,
};
