import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric128",
  title: "Isometric Fuse Box",
  description:
    "An open breaker panel hangs on a wall with its door swung out. One by one the switches flip up and light in the accent color, then the row resets.",
  category: "Isometric",
  usage: `import { Isometric128 } from "@/components/beste/piece/isometric128";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric128 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Licensed electricians at your door in 2 hours.
  </p>
</div>`,
};
