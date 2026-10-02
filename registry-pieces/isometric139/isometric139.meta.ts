import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric139",
  title: "Isometric Birthday Cake",
  description:
    "A two tier cake sits on a round stand with a single candle on top. Its flame, in the accent color, leans and flickers inside a soft halo of light.",
  category: "Isometric",
  usage: `import { Isometric139 } from "@/components/beste/piece/isometric139";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric139 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Order a custom cake 48 hours ahead.
  </p>
</div>`,
};
