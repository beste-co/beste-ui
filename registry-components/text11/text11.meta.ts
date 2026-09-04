import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text11",
  title: "Ink Drying",
  description:
    "Words that begin as soft, spread blots of ink, wide-set and out of focus, and dry into crisp, tightly set type one after another.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text11 } from "@/components/beste/component/text11";

<Text11 as="h2" text="Slow, on purpose." className="font-serif text-6xl" />

<Text11
  as="h1"
  text="Come as you are."
  trigger="mount"
  stagger={0.15}      // seconds between words
  duration={2}        // seconds each word takes to dry
/>`,
};
