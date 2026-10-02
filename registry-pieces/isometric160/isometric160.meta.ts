import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric160",
  title: "Isometric Toy Blocks",
  description:
    "Wooden letter blocks drop onto a play mat one at a time and settle with a small bounce. The last block lands on top in the accent color before the stack clears and builds again.",
  category: "Isometric",
  usage: `import { Isometric160 } from "@/components/beste/piece/isometric160";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric160 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Daily updates for 40 families, photos included.
  </p>
</div>`,
};
