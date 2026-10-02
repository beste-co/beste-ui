import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric76",
  title: "Isometric Paint Palette",
  description:
    "A wooden style palette with a thumb hole holds a row of paint dabs and one pool in the accent color. A brush dips into the pool and lifts with its tip colored.",
  category: "Isometric",
  usage: `import { Isometric76 } from "@/components/beste/piece/isometric76";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric76 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Pick from 12 brand colors, shared across every file.
  </p>
</div>`,
};
