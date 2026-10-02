import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric90",
  title: "Isometric Sewing Machine",
  description:
    "A sewing machine runs its needle up and down over a piece of fabric in the accent color, leaving a line of stitches behind as the cloth feeds through.",
  category: "Isometric",
  usage: `import { Isometric90 } from "@/components/beste/piece/isometric90";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric90 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Take 30 made to measure orders a week.
  </p>
</div>`,
};
