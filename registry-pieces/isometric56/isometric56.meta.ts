import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric56",
  title: "Isometric Justice Scale",
  description:
    "A balance scale stands on a round base with a stack of weights on one pan and a box in the accent color on the other. The beam tips toward the weights, rocks back and forth and settles level, the pans hanging from its ends on cords.",
  category: "Isometric",
  usage: `import { Isometric56 } from "@/components/beste/piece/isometric56";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric56 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Contracts reviewed by 40 licensed lawyers.
  </p>
</div>`,
};
