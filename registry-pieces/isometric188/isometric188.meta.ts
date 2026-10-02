import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric188",
  title: "Isometric Fitness Rings",
  description:
    "A phone on a desk stand shows three activity rings that close one after another in the accent color above the step count and a week of bars, with a water bottle standing beside the stand.",
  category: "Isometric",
  usage: `import { Isometric188 } from "@/components/beste/piece/isometric188";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric188 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Close your rings every day.
  </p>
</div>`,
};
