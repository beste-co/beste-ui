import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card4",
  title: "Product Card",
  description:
    "A product card with image, price, discount badge, wishlist toggle, and add to cart action for shop grids.",
  category: "Card",
  usage: `import { Card4 } from "@/components/beste/component/card4";

// Image and name link to href; heart and CTA stay independently clickable.
<Card4
  src="/products/watch.jpg"
  name="Atlas Field Watch"
  price="$249"
  compareAt="$320"   // struck-through original price
  badge="-22%"       // corner badge
  rating={4.8}
  href="/products/atlas-field-watch"
  onAdd={() => console.log("added to cart")}
  onWishlist={(on) => console.log("wishlist", on)}
/>

<Card4
  src="/products/lamp.jpg"
  name="Dune Desk Lamp"
  price="$89"
  ctaLabel="Buy now"
  tone="primary"   // CTA: "dark" (default) | "primary"
  onAdd={() => console.log("buy now")}
/>`,
};
