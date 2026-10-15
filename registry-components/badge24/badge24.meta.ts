import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge24",
  title: "Rule Eyebrow",
  description:
    "A sentence-case eyebrow with a short rule in front of it. The rule draws from the left and the text rises in behind it, on scroll by default or at once for heroes. Both take the current text color, so one class puts it on a photograph.",
  category: "Badge",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Badge24 } from "@/components/beste/component/badge24";

<Badge24 text="Alder Row, Riverside" />

<Badge24
  text="The residences"
  as="span"            // "p" (default) | "span" | "div"
  trigger="mount"      // "view" (default) | "mount" | "none"
  delay={0.2}          // seconds before the rule draws
  className="text-background/80"   // color for dark or photographic surfaces
/>`,
};
