import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge20",
  title: "Logo Strip Badge",
  description:
    "A trusted by logo strip badge with grayscale logos that regain color on hover.",
  category: "Badge",
  usage: `import { Badge20 } from "@/components/beste/component/badge20";

<Badge20
  label="Trusted by"
  logos={[
    { src: "/logos/acme.svg", alt: "Acme" },
    { src: "/logos/globex.svg", alt: "Globex" },
    { src: "/logos/initech.svg", alt: "Initech" },
  ]}
/>

<Badge20
  logos={[{ src: "/logos/acme.svg", alt: "Acme" }]}
  height={32}          // logo height in px (default 24)
  grayscale={false}    // full-color logos
  tone="foreground"    // label color: "muted" (default) | "foreground"
/>`,
};
