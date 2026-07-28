import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "card6",
  title: "Portfolio Card",
  description:
    "A portfolio card with a full bleed image, hover zoom, and gradient title overlay for work showcases.",
  category: "Card",
  usage: `import { Card6 } from "@/components/beste/component/card6";

// The whole card becomes a link when href is set.
<Card6
  src="/work/nordwind.jpg"
  title="Nordwind Studio"
  subtitle="Brand identity"
  href="/work/nordwind"
/>

<Card6
  src="/work/lumen.jpg"
  title="Lumen App"
  subtitle="Product design"
  tone="primary"   // arrow seal: "light" (default) | "primary"
/>`,
};
