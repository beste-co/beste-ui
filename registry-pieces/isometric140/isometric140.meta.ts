import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric140",
  title: "Isometric Flower Bouquet",
  description:
    "A round vase holds a small bouquet of buds on slender stems. The flower in the accent color slowly opens its petals, holds, then folds back into a bud.",
  category: "Isometric",
  usage: `import { Isometric140 } from "@/components/beste/piece/isometric140";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric140 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Fresh bouquets delivered in 2 hours.
  </p>
</div>`,
};
