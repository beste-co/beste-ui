import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card23",
  title: "Lanyard Badge Card",
  description:
    "A conference lanyard badge card with strap, portrait, access tag, and barcode that sways on hover.",
  category: "Card",
  usage: `import { Card23 } from "@/components/beste/component/card23";

// The badge sways gently from its clip on hover.
<Card23
  src="/team/deniz.jpg"
  name="Deniz Arslan"
  role="Creative Director"
  company="Beste Conf 2027"
  tag="Speaker"
  code="ATT-0087"   // printed under the barcode, seeds the bars
/>

<Card23
  src="/team/elif.jpg"
  name="Elif Kaya"
  role="Engineering Lead"
  tag="Crew"
  tone="emerald"   // strap and tag: "primary" (default) | "emerald" | "rose"
/>`,
};
