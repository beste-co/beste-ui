import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric2",
  title: "Isometric Tile Wave",
  description:
    "A five by five field of isometric tiles lifts in a diagonal wave, each tile catching the accent color as it peaks.",
  category: "Isometric",
  usage: `import { Isometric2 } from "@/components/beste/piece/isometric2";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric2 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Traffic spreads across 40 regions.
  </p>
</div>`,
};
