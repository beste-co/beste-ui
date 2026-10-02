import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric224",
  title: "Isometric Image Optimization",
  description:
    "A large, thick image tile slides into the back of a press on a desk and a smaller, thinner copy of the same picture slides out of the slot on the other side, while the weight gauge on the press drops in the accent color. The light copy then fades and the next original arrives.",
  category: "Isometric",
  usage: `import { Isometric224 } from "@/components/beste/piece/isometric224";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric224 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Smaller files, the same picture.
  </p>
</div>`,
};
