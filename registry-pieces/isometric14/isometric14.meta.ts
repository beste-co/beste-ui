import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric14",
  title: "Isometric Parcel Box",
  description:
    "A shipping box opens its flaps and a small cube in the accent color rises out of it, then sinks back as the lid folds shut again.",
  category: "Isometric",
  usage: `import { Isometric14 } from "@/components/beste/piece/isometric14";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric14 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Orders packed and shipped within 24 hours.
  </p>
</div>`,
};
