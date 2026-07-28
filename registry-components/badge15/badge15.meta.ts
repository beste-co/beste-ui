import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge15",
  title: "Stat Badge",
  description:
    "A stat badge with an icon, bold value, and label for quick hero metrics.",
  category: "Badge",
  usage: `import { Badge15 } from "@/components/beste/component/badge15";
import { Rocket } from "lucide-react";

<Badge15 value="12k+" label="active users" />

<Badge15
  value="99.9%"
  label="uptime"
  icon={Rocket}        // leading icon (default: Users)
  tone="foreground"    // "primary" (default) | "foreground" | "muted"
/>`,
};
