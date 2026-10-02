import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric122",
  title: "Isometric Chess Board",
  description:
    "A real endgame on a full board: the white queen in the accent color lifts off d1, glides up the open file and sets down on d8 for a back rank checkmate.",
  category: "Isometric",
  usage: `import { Isometric122 } from "@/components/beste/piece/isometric122";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric122 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Plan 3 moves ahead with 1 shared roadmap.
  </p>
</div>`,
};
