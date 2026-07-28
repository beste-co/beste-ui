import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card28",
  title: "Promo Card",
  description:
    "A dismissible promo card with image, deadline line, and apply button for programs and offers.",
  category: "Card",
  usage: `import { Card28 } from "@/components/beste/component/card28";

// The corner X hides the banner and fires onDismiss.
<Card28
  src="/promos/beta.jpg"
  title="Join the beta program"
  description="Help shape the new builder before launch."
  highlight="Only 25 seats"
  note="Applications close Jul 18."
  cta="Request access"
  href="/beta"
  onDismiss={() => console.log("dismissed")}
/>

<Card28
  src="/promos/workshop.jpg"
  title="Free workshop this Thursday"
  cta="Save my seat"
  permanent     // hide the dismiss button
  tone="dark"   // CTA: "primary" (default) | "dark"
  onClick={() => console.log("save seat")}
/>`,
};
