import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric218",
  title: "Isometric Product Filters",
  description:
    "A filter panel with chips, checkboxes and a price range sits beside a product grid. The range thumb slides along its track, the cards outside the range dim together, and everything returns when the thumb slides back.",
  category: "Isometric",
  usage: `import { Isometric218 } from "@/components/beste/piece/isometric218";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric218 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Filters that narrow the grid as you move.
  </p>
</div>`,
};
