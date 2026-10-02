import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric177",
  title: "Isometric Mobile Payment",
  description:
    "A phone on a desk stand shows a payment card in the accent color beside a small card reader. Contactless waves travel from the phone to the reader, its display lights up, and a check draws itself on the screen above the amount.",
  category: "Isometric",
  usage: `import { Isometric177 } from "@/components/beste/piece/isometric177";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric177 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Take contactless payments from day one.
  </p>
</div>`,
};
