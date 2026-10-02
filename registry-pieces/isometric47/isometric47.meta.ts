import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric47",
  title: "Isometric Book Stack",
  description:
    "Three books lie in a stack with two smaller ones on top, one bound in the accent color. Its cover swings open onto the book beside it, five pages riffle over in quick succession, then they flick back and the book closes.",
  category: "Isometric",
  usage: `import { Isometric47 } from "@/components/beste/piece/isometric47";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric47 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    120 courses you can finish in a week.
  </p>
</div>`,
};
