import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge8",
  title: "Pulse Status Badge",
  description:
    "A status badge with a pulsing dot for availability, live states, and system health.",
  category: "Badge",
  usage: `import { Badge8 } from "@/components/beste/component/badge8";

<Badge8 label="Available for new projects" />

<Badge8
  label="Maintenance window"
  tone="warning"   // "success" (default) | "info" | "warning" | "muted"
  still            // static dot, no ping animation
/>`,
};
