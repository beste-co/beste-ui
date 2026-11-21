import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge26",
  title: "Tone Pill",
  description:
    "A small filled pill for plan flags, offers and mode chips: the bright secondary, the primary, the soft accent, or a translucent pill that takes the current text color on dark cards.",
  category: "Badge",
  usage: `import { Badge26 } from "@/components/beste/component/badge26";

<Badge26 label="Most chosen" />

<Badge26
  label="2 months free"
  tone="glass"   // "secondary" (default) | "primary" | "accent" | "glass"
/>`,
};
