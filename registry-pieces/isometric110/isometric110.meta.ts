import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "isometric110",
  title: "Isometric Shopping Cart",
  description:
    "A wire shopping cart rolls in and stops while a parcel in the accent color and a small tin drop into its basket, then it rolls on with both on board.",
  category: "Isometric",
  usage: `import { Isometric110 } from "@/components/beste/piece/isometric110";

// Give it the card's media area; the drawing scales to fit and centers itself.
// palette: "theme" | "light" | "dark" | "tone", accent={false} for one color.
<div className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-border bg-card">
  <Isometric110 tone="color" color="#2F6FED" palette="theme" className="min-h-0 flex-1" />
  <p className="px-8 pb-8 text-center text-lg text-muted-foreground">
    Checkout in 3 taps, saved carts for 30 days.
  </p>
</div>`,
};
