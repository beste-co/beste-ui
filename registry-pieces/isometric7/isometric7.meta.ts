import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric7",
  title: "Isometric Bar Chart",
  description:
    "Five bars rise out of an isometric base one after another and sink back, climbing toward the tallest bar at the front in the accent color.",
  category: "Isometric",
  usage: `import { Isometric7 } from "@/components/beste/piece/isometric7";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric7 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Revenue up 38% in 6 months.
  </p>
</div>`,
};
