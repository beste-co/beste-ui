import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text1",
  title: "Word Stagger",
  description:
    "Text that settles in one word at a time, each word rising a few pixels out of a soft blur. Plays on scroll by default, or immediately for heroes.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text1 } from "@/components/beste/component/text1";

<Text1
  as="h2"                       // "h1" | "h2" | "h3" | "p" | "blockquote" | "span"
  text="Room to breathe, and a way forward."
  className="font-serif text-5xl"
/>

<Text1
  as="h1"
  text="A steady hour in an unsteady week."
  trigger="mount"   // play at once instead of on scroll
  delay={0.3}       // seconds before the first word
  stagger={0.07}    // seconds between words
/>`,
};
