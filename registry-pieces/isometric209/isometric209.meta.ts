import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric209",
  title: "Isometric Media Slot",
  description:
    "A section lies on a desk as a thick slab with a heading, copy and a button, and an open slot where its media goes. An art tile slides along the desk into the slot, sits there, then slides back out and returns with a different picture.",
  category: "Isometric",
  usage: `import { Isometric209 } from "@/components/beste/piece/isometric209";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric209 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every media slot takes an image, a video or a piece.
  </p>
</div>`,
};
