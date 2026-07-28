import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card20",
  title: "Step Card",
  description:
    "A numbered step card with a ghost number, title, and description for how it works sections.",
  category: "Card",
  usage: `import { Card20 } from "@/components/beste/component/card20";

<Card20
  step="01"
  title="Pick a block"
  description="Browse the registry and copy the install command."
/>

<Card20
  step="02"
  title="Make it yours"
  description="Adjust colors, spacing, and copy with Tailwind."
  tone="primary"   // ghost number: "muted" (default) | "primary"
/>`,
};
