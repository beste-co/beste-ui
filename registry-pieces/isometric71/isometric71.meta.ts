import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric71",
  title: "Isometric Camera",
  description:
    "A chunky camera with a lens barrel pushed toward the viewer. The shutter button dips and the flash window fires a short burst in the accent color.",
  category: "Isometric",
  usage: `import { Isometric71 } from "@/components/beste/piece/isometric71";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric71 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Upload 200 photos in 1 go, sorted by date.
  </p>
</div>`,
};
