import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge23",
  title: "Mono Eyebrow Badge",
  description:
    "A hairline, softly rounded eyebrow pill with an uppercase, letter-spaced monospace label for section kickers.",
  category: "Badge",
  usage: `import { Badge23 } from "@/components/beste/component/badge23";

<Badge23 label="Product" />

<Badge23
  label="Value prop"
  tone="foreground"   // "muted" (default) | "foreground" | "primary"
/>`,
};
