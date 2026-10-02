import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric212",
  title: "Isometric Unlimited Pages",
  description:
    "Pages stand upright in a rack on a desk, one behind the other like index cards, each printed with its own layout: home, pricing, blog, contact and gallery. The last page sinks into the rack, the row moves back a place and a new page rises from the slot at the front, again and again, with a detail or two on each page in the accent color.",
  category: "Isometric",
  usage: `import { Isometric212 } from "@/components/beste/piece/isometric212";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric212 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Add as many pages as the site needs.
  </p>
</div>`,
};
