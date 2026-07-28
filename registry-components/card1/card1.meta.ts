import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card1",
  title: "Spotlight Feature Card",
  description:
    "A feature card with an icon tile and a cursor tracking spotlight for landing page feature grids.",
  category: "Card",
  usage: `import { Card1 } from "@/components/beste/component/card1";
import { Rocket } from "lucide-react";

// The whole card becomes a link when href is set.
<Card1
  title="Ship in minutes"
  description="Copy a block, wire up your content, and deploy."
  href="/docs"
/>

<Card1
  icon={Rocket}         // tile icon (default: Zap)
  title="Fast by default"
  description="Server components and zero runtime dependencies."
  linkLabel="Read the docs"
  tone="foreground"     // "primary" (default) | "foreground"
/>`,
};
