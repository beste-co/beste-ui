import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric52",
  title: "Isometric Coin Stacks",
  description:
    "Four stacks of coins rise on a rounded plate, one coin dropping at a time from the shortest stack to the tallest, which is drawn in the accent color.",
  category: "Isometric",
  usage: `import { Isometric52 } from "@/components/beste/piece/isometric52";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric52 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Returns reinvested every 30 days.
  </p>
</div>`,
};
