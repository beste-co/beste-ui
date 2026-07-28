import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card13",
  title: "Flip Card",
  description:
    "A 3D flip card that rotates on hover to reveal details and a link for service and feature grids.",
  category: "Card",
  usage: `import { Card13 } from "@/components/beste/component/card13";
import { Palette } from "lucide-react";

// Hover (or keyboard focus) flips the card to the detail face.
<Card13
  title="Brand systems"
  description="Identity, guidelines, and design tokens that scale."
  href="/services/brand"
  linkLabel="Explore service"
/>

<Card13
  icon={Palette}   // front icon (default: Layers)
  title="Art direction"
  description="Campaign visuals from moodboard to final delivery."
  href="/services/art"
  tone="primary"   // back face: "dark" (default) | "primary"
/>`,
};
