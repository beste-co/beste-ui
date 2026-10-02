import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric84",
  title: "Isometric Brick Wall",
  description:
    "Two low brick walls meet at a corner, and the top course is laid one brick at a time in the accent color before the row clears and starts again.",
  category: "Isometric",
  usage: `import { Isometric84 } from "@/components/beste/piece/isometric84";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric84 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Quote a 3 room renovation in 10 minutes.
  </p>
</div>`,
};
