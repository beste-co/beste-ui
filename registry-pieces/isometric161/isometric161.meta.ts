import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric161",
  title: "Isometric Wardrobe",
  description:
    "Both doors of a two door wardrobe swing out on their hinges, showing a rail of clothes with one garment in the accent color, then swing shut again.",
  category: "Isometric",
  usage: `import { Isometric161 } from "@/components/beste/piece/isometric161";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric161 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    New season, same wardrobe.
  </p>
</div>`,
};
