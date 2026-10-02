import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric154",
  title: "Isometric 3D Printer",
  description:
    "A framed 3D printer sweeps its print head back and forth and builds a small part in the accent color one layer at a time, then clears the bed and starts again.",
  category: "Isometric",
  usage: `import { Isometric154 } from "@/components/beste/piece/isometric154";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric154 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    From sketch to prototype in 48 hours.
  </p>
</div>`,
};
