import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card21",
  title: "Stat Card",
  description:
    "A minimal stat card with a bold value, label, and optional trend delta for metrics rows.",
  category: "Card",
  usage: `import { Card21 } from "@/components/beste/component/card21";

<Card21
  value="98%"
  label="Customer satisfaction"
  delta="+2.1%"
  trend="up"       // "up" (default) | "down"
  description="vs last quarter"
/>

<Card21
  value="12k+"
  label="Active teams"
  tone="primary"   // value: "foreground" (default) | "primary"
/>`,
};
