import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric250",
  title: "Isometric Project Dashboard",
  description:
    "A board on a desk holds a grid of project cards, each with a small page thumbnail and a status dot. A new card slides out from under the add bar into the empty cell and its dot takes the accent color.",
  category: "Isometric",
  usage: `import { Isometric250 } from "@/components/beste/piece/isometric250";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric250 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every project in one place.
  </p>
</div>`,
};
