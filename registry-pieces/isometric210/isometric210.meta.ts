import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric210",
  title: "Isometric Font Pairing",
  description:
    "A type specimen sheet leans on a desk stand with two letter tiles beside it, one for each typeface. The sheet's sample letters, heading and body lines fade from a round sans pairing to a serif pairing and back, and the tile of the face in use takes the accent color.",
  category: "Isometric",
  usage: `import { Isometric210 } from "@/components/beste/piece/isometric210";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric210 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Change the font pairing and every page follows.
  </p>
</div>`,
};
