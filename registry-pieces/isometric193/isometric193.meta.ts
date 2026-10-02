import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric193",
  title: "Isometric Calendar Event",
  description:
    "A phone on a desk stand shows a month grid. One day lights up in the accent color and an event card slides up from the bottom of the screen with its details and a join button, next to a small desk calendar block.",
  category: "Isometric",
  usage: `import { Isometric193 } from "@/components/beste/piece/isometric193";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric193 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Every meeting lands in your calendar.
  </p>
</div>`,
};
