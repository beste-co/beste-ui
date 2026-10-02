import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric111",
  title: "Isometric Cash Register",
  description:
    "A countertop cash register with a sloped keypad and a small customer display. Its drawer slides out with notes in the accent color and stacks of coins, holds open, then closes again.",
  category: "Isometric",
  usage: `import { Isometric111 } from "@/components/beste/piece/isometric111";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric111 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Card, cash and tap, settled in 1 day.
  </p>
</div>`,
};
