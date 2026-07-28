import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "badge7",
  title: "Parenthetical Eyebrow",
  description:
    "A monospace eyebrow badge that wraps its label in brackets, with a vertical orientation option.",
  category: "Badge",
  usage: `import { Badge7 } from "@/components/beste/component/badge7";

<Badge7 label="About" />

<Badge7
  label="Est. 2019"
  bracket="square"    // "round" (default) | "square" | "curly" | "angle" | "none"
  tone="foreground"   // "muted" (default) | "foreground" | "primary"
  vertical            // rotate for edge placement (e.g. along a hero side)
/>`,
};
