import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card14",
  title: "Receipt Card",
  description:
    "A thermal receipt card with itemized dotted rows, a torn zigzag edge, and a barcode for pricing recaps.",
  category: "Card",
  usage: `import { Card14 } from "@/components/beste/component/card14";

<Card14
  store="Beste Studio"
  meta="INV-2026-0142 * Jul 02"
  items={[
    { label: "Landing page", value: "$1,900" },
    { label: "Brand refresh", value: "$2,400" },
  ]}
  total="$4,300"
  note="* Thank you, see you again *"
  code="INV-2026-0142"   // seeds the barcode; omit to hide it
/>

<Card14
  store="Order summary"
  items={[{ label: "Pro plan", value: "$19" }]}
  total="$19"
  totalLabel="Due today"
  tone="primary"    // accents: "ink" (default) | "primary"
  tilted={false}    // disable the paper rotation
/>`,
};
