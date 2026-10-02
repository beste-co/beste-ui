import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric35",
  title: "Isometric Pizza Box",
  description:
    "The lid of a pizza box swings open and a slice in the accent color lifts high out of the pie on strands of cheese, then drops back as the box closes.",
  category: "Isometric",
  usage: `import { Isometric35 } from "@/components/beste/piece/isometric35";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric35 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Hot food at your door in 25 minutes.
  </p>
</div>`,
};
