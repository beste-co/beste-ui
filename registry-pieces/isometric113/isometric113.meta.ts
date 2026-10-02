import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric113",
  title: "Isometric Price Tag",
  description:
    "A price tag in the accent color hangs from a peg on a short string, marked with a large percent sign. It gets a nudge, swings a few times and settles.",
  category: "Isometric",
  usage: `import { Isometric113 } from "@/components/beste/piece/isometric113";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric113 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Run a 20% sale across 400 products at once.
  </p>
</div>`,
};
