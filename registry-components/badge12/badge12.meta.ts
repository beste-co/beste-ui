import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge12",
  title: "Rating Badge",
  description:
    "A star rating badge with a numeric value and review text for social proof sections.",
  category: "Badge",
  usage: `import { Badge12 } from "@/components/beste/component/badge12";

<Badge12 value={4.9} text="from 200+ reviews" />

<Badge12
  value={5}
  tone="primary"    // "amber" (default) | "primary" | "foreground"
  showValue={false} // stars only
  text="Rated 5 stars on G2"
/>`,
};
