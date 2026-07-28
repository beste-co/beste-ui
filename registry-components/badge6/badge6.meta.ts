import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge6",
  title: "Eyebrow Badge",
  description:
    "An eyebrow kicker badge with an accent square and uppercase, letter spaced label for section headings.",
  category: "Badge",
  usage: `import { Badge6 } from "@/components/beste/component/badge6";

<Badge6 label="About us" />

<Badge6
  label="Our services"
  tone="foreground"          // accent square: "primary" (default) | "foreground" | "muted"
  orientation="vertical"     // stack the square above the label
  labelClassName="text-background/70"   // override label classes on dark surfaces
/>`,
};
