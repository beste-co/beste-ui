import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card11",
  title: "Event Ticket Card",
  description:
    "An event ticket card with punched notches, a perforated barcode stub, and detail columns for launches and conferences.",
  category: "Card",
  usage: `import { Card11 } from "@/components/beste/component/card11";

<Card11
  eyebrow="Admit one"
  event="Beste Conf 2027"
  holder="Selin Aksoy"
  details={[
    { label: "Date", value: "Mar 14" },
    { label: "Seat", value: "A12" },
    { label: "Gate", value: "03" },
  ]}
  code="BST-0421"   // printed on the stub, seeds the barcode
/>

<Card11
  event="Launch party"
  details={[{ label: "When", value: "Fri 21:00" }]}
  tone="neutral"   // "dark" (default) | "primary" | "neutral"
/>`,
};
