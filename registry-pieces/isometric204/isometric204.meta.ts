import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric204",
  title: "Isometric Theme Looks",
  description:
    "A browser page stands on a desk stand with three round swatches in front of it. A selector ring slides from swatch to swatch and each time the page fades into another look: pill, rounded or square corners, a different card layout and the accent color on different elements.",
  category: "Isometric",
  usage: `import { Isometric204 } from "@/components/beste/piece/isometric204";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric204 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    One page, three looks, one click each.
  </p>
</div>`,
};
