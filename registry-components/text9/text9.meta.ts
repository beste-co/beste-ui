import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text9",
  title: "Soft Blur In",
  description:
    "A paragraph or heading that arrives as one piece, rising a few pixels out of a soft blur when it scrolls into view. The quiet companion to the word stagger, for body copy and descriptions.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text9 } from "@/components/beste/component/text9";

<Text9
  as="p"
  text="Forty minutes to see whether this feels like a place you could talk."
  className="text-lg text-muted-foreground"
/>

<Text9 as="h2" text="Still here." trigger="mount" blur={16} y={20} delay={0.4} />`,
};
