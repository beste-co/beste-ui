import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric148",
  title: "Isometric Sailboat",
  description:
    "A small sailboat rocks gently on a rounded patch of water while soft rings spread out around its hull. The mainsail carries the accent color.",
  category: "Isometric",
  usage: `import { Isometric148 } from "@/components/beste/piece/isometric148";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric148 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Book a berth in 60 marinas, no calls needed.
  </p>
</div>`,
};
