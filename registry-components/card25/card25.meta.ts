import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card25",
  title: "Product Overlay Card",
  description:
    "A product card with a full bleed photo, overlaid name and price, and a floating pill button.",
  category: "Card",
  usage: `import { Card25 } from "@/components/beste/component/card25";

// Button renders a <Link> when href is set, otherwise a <button>.
<Card25
  src="/products/orbit-one.jpg"
  name="Orbit One"
  price="$189"
  cta="Shop now"
  href="/products/orbit-one"
/>

<Card25
  src="/products/night-edition.jpg"
  name="Night Edition"
  price="$24/m"
  cta="Preorder"
  tone="primary"   // pill: "light" (default) | "primary"
  onClick={() => console.log("preorder")}
/>`,
};
