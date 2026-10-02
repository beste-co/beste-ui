import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric150",
  title: "Isometric Cash Machine",
  description:
    "A freestanding cash machine with a screen and keypad slides a stack of banknotes in the accent color out of its slot, holds them out, then they are taken and the next stack follows.",
  category: "Isometric",
  usage: `import { Isometric150 } from "@/components/beste/piece/isometric150";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric150 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Free withdrawals at 2,500 cash machines.
  </p>
</div>`,
};
