import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric185",
  title: "Isometric Mobile Checkout",
  description:
    "A phone on a desk stand shows a product page: the add to cart button is pressed, a thumbnail flies up into the cart, a checkout sheet slides up and a check in the accent color confirms the order while a small parcel beside the stand gives a hop.",
  category: "Isometric",
  usage: `import { Isometric185 } from "@/components/beste/piece/isometric185";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone" | "glass" (see-through, for a photo or gradient behind it), accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric185 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    From product page to paid in three taps.
  </p>
</div>`,
};
