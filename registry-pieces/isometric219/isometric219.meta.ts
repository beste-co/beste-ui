import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric219",
  title: "Isometric Blog Posts",
  description:
    "A stack of thick article cards sits beside a reading desk. The top card slides across onto the desk, its cover in the accent color, and the lines of the article fade in beside it before the card slides back onto the stack.",
  category: "Isometric",
  usage: `import { Isometric219 } from "@/components/beste/piece/isometric219";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric219 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Write it once, publish it anywhere on your site.
  </p>
</div>`,
};
