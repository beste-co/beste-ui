import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge9",
  title: "Trend Delta Badge",
  description:
    "A metric delta badge with trend arrows for dashboards, stat rows, and pricing tables.",
  category: "Badge",
  usage: `import { Badge9 } from "@/components/beste/component/badge9";

<Badge9 value="+12.4%" label="vs last month" />

<Badge9
  value="-3.2%"
  tone="down"   // "up" (default) | "down" | "flat"
/>`,
};
