import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card12",
  title: "Polaroid Card",
  description:
    "An instant photo card with masking tape, serif caption, and a tilt that straightens on hover for galleries.",
  category: "Card",
  usage: `import { Card12 } from "@/components/beste/component/card12";

// The whole polaroid becomes a link when href is set.
<Card12
  src="/photos/alacati.jpg"
  caption="Summer in Alacati"
  date="Aug 2026"
  href="/gallery/alacati"
/>

<Card12
  src="/photos/team.jpg"
  caption="The whole crew"
  untaped         // hide the tape strip
  tone="sky"      // tape: "sand" (default) | "sky" | "rose"
/>`,
};
