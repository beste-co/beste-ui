import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric101",
  title: "Isometric Bakery Oven",
  description:
    "A deck oven stands on four short legs with a loaf in the accent color rising behind its glass door. The heating strip inside glows softly while the dough swells.",
  category: "Isometric",
  usage: `import { Isometric101 } from "@/components/beste/piece/isometric101";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric101 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Fresh bread out of the oven every 2 hours.
  </p>
</div>`,
};
