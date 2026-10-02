import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric178",
  title: "Isometric Wireless Charging",
  description:
    "A phone leans on a round wireless charging stand while a ring on its screen fills in the accent color, ticks light up one by one and a check lands when it is full. Soft rings spread over the base and the stand light breathes.",
  category: "Isometric",
  usage: `import { Isometric178 } from "@/components/beste/piece/isometric178";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric178 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    A full charge before your coffee is done.
  </p>
</div>`,
};
