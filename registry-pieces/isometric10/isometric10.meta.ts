import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric10",
  title: "Isometric Desk Calendar",
  description:
    "Two pages settle onto a desk calendar block and flip away one at a time, uncovering the current date printed in the accent color.",
  category: "Isometric",
  usage: `import { Isometric10 } from "@/components/beste/piece/isometric10";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric10 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a call in 3 clicks, any day of the week.
  </p>
</div>`,
};
