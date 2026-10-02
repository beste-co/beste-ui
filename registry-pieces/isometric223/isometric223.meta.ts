import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric223",
  title: "Isometric AI Image Generation",
  description:
    "A prompt bar on a desk has a line typed into it, its send button is pressed, and the thick image tile behind it develops: an empty frame turns into coarse cells and then into a finished landscape with its sun in the accent color. A small raised spark marks the bar, and the tile clears before the next prompt.",
  category: "Isometric",
  usage: `import { Isometric223 } from "@/components/beste/piece/isometric223";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric223 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Describe the image, get the image.
  </p>
</div>`,
};
