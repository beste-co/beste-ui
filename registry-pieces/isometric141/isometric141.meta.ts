import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric141",
  title: "Isometric Cinema Popcorn",
  description:
    "A popcorn bucket with stripes in the accent color sits beside a movie ticket. Kernels pop up from the heap one after another and drop back in.",
  category: "Isometric",
  usage: `import { Isometric141 } from "@/components/beste/piece/isometric141";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric141 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Reserve your seats 7 days ahead.
  </p>
</div>`,
};
