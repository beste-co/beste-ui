import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card17",
  title: "Vinyl Record Card",
  description:
    "A vinyl record card whose disc slides out of the sleeve and spins on hover for music and creative landings.",
  category: "Card",
  usage: `import { Card17 } from "@/components/beste/component/card17";

// The disc peeks out at rest and slides out spinning on hover.
<Card17
  title="Midnight Frequencies"
  artist="Aurora Fields"
  catalog="BST-004"
/>

<Card17
  title="Field Notes, Vol. 2"
  artist="Beste Studio"
  src="/covers/field-notes.jpg"   // optional cover art
  tone="sand"                     // sleeve: "ink" (default) | "primary" | "sand"
/>`,
};
