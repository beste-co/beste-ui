import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card3",
  title: "Testimonial Card",
  description:
    "A testimonial card with star rating, quote, and author row for reviews and social proof sections.",
  category: "Card",
  usage: `import { Card3 } from "@/components/beste/component/card3";

<Card3
  quote="We rebuilt our marketing site in a weekend. The code reads like we wrote it ourselves."
  name="Selin Aksoy"
  role="Founder, Nordwind"
  src="/avatars/selin.jpg"
  rating={5}      // 0 to 5, omit to hide the stars
/>

<Card3
  quote="The fastest way we have found to ship landing pages."
  name="Mert Aydin"
  role="CTO, Lumen"
  tone="muted"    // "neutral" (default) | "muted"
/>`,
};
