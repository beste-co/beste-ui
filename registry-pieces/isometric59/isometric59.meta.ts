import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric59",
  title: "Isometric Calculator",
  description:
    "Keys on a flat calculator press down one after another to type 64 plus 8, each digit appearing on the display as its key goes down, ending on the equals key in the accent color and the answer 72.",
  category: "Isometric",
  usage: `import { Isometric59 } from "@/components/beste/piece/isometric59";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric59 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Sales tax worked out for 50 states.
  </p>
</div>`,
};
