import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card26",
  title: "Product Teaser Card",
  description:
    "A portrait product teaser card with brand header, availability footer, and a pill button for coming soon pages.",
  category: "Card",
  usage: `import { Card26 } from "@/components/beste/component/card26";

// Button renders a <Link> when href is set, otherwise a <button>.
<Card26
  src="/products/lumo-camera.jpg"
  brand="LUMO"
  subtitle="Field Camera"
  status="Launching Friday"
  statusNote="Join the waitlist"
  cta="Join list"
  href="/waitlist"
/>

<Card26
  src="/products/atlas-black.jpg"
  brand="ATLAS"
  status="Back in stock"
  cta="Order"
  tone="primary"   // pill: "light" (default) | "primary"
  onClick={() => console.log("order")}
/>`,
};
