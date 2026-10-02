import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric98",
  title: "Isometric Parking Gate",
  description:
    "A small car pulls up to a parking gate and waits while the striped barrier arm swings up, then drives on as the arm lowers again.",
  category: "Isometric",
  usage: `import { Isometric98 } from "@/components/beste/piece/isometric98";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric98 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Plates read at the gate in under 1 second.
  </p>
</div>`,
};
