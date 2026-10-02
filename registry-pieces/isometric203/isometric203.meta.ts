import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric203",
  title: "Isometric Responsive Preview",
  description:
    "A desktop monitor, a tablet and a phone stand together on a desk showing the same page at their own widths, with the hero in the accent color; the page scrolls a little on all three in step and returns.",
  category: "Isometric",
  usage: `import { Isometric203 } from "@/components/beste/piece/isometric203";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric203 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One page, every screen.
  </p>
</div>`,
};
