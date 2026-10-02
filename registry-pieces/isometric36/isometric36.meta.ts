import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric36",
  title: "Isometric New Home",
  description:
    "A small gabled house stands on its plot behind a for sale sign. A sold plate in the accent color swings down onto its hooks and settles, then the windows light up one by one and smoke rises from the chimney.",
  category: "Isometric",
  usage: `import { Isometric36 } from "@/components/beste/piece/isometric36";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric36 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Sold in 9 days, at 4% over asking.
  </p>
</div>`,
};
