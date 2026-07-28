import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge17",
  title: "Notification Badge",
  description:
    "A toast style notification badge with an icon tile, title, and description for product updates.",
  category: "Badge",
  usage: `import { Badge17 } from "@/components/beste/component/badge17";
import { Rocket } from "lucide-react";

<Badge17 title="New template added" description="The Auralis studio set is live" />

<Badge17
  title="v2.0 shipped"
  description="See what's new"
  icon={Rocket}     // tile icon (default: BellRing)
  tone="emerald"    // "primary" (default) | "emerald" | "amber"
/>`,
};
