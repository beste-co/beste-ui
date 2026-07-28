import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card9",
  title: "Gradient Beam Card",
  description:
    "A featured callout card wrapped in an orbiting gradient border beam for highlights and announcements.",
  category: "Card",
  usage: `import { Card9 } from "@/components/beste/component/card9";
import { Crown } from "lucide-react";

// The whole card becomes a link when href is set.
<Card9
  badge="Featured"
  title="Pro blocks drop monthly"
  description="A new themed set of sections lands every month."
  href="/pricing"
/>

<Card9
  icon={Crown}      // tile icon (default: Gem)
  title="Lifetime deal"
  description="Pay once, keep every future update."
  linkLabel="See pricing"
  tone="aurora"     // beam: "primary" (default) | "aurora"
/>`,
};
