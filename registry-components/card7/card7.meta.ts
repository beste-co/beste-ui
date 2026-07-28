import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card7",
  title: "3D Tilt Card",
  description:
    "A 3D tilt card that rotates in perspective toward the cursor with a moving glare for product showcases.",
  category: "Card",
  usage: `import { Card7 } from "@/components/beste/component/card7";

// The whole card becomes a link when href is set.
<Card7
  src="/products/atlas-deck.jpg"
  eyebrow="Hardware"
  title="Meet the Atlas Deck"
  description="A modular controller for creative tools."
  href="/products/atlas-deck"
/>

<Card7
  src="/products/keyboard.jpg"
  title="Muted mechanical"
  maxTilt={14}         // tilt strength in degrees (default 10)
  tone="foreground"    // eyebrow: "primary" (default) | "foreground"
/>`,
};
