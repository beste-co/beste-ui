import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric189",
  title: "Isometric Photo Gallery",
  description:
    "A phone on a desk stand shows a photo album: the pictures swipe through the viewer one after another while a frame in the accent color follows along the thumbnails below, with a small stack of prints lying beside the stand.",
  category: "Isometric",
  usage: `import { Isometric189 } from "@/components/beste/piece/isometric189";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric189 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every shot, one swipe away.
  </p>
</div>`,
};
