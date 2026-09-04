import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text7",
  title: "Count Up",
  description:
    "A figure that counts up from zero to its value the first time it scrolls into view, with a prefix, a suffix, decimals and thousands grouping, in tabular numerals so nothing shifts.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text7 } from "@/components/beste/component/text7";

<Text7 value={2400} suffix="+" as="p" className="font-serif text-6xl" />

<Text7
  value={4.9}
  decimals={1}
  prefix=""
  duration={2}         // seconds
  grouping={false}     // no thousands separators (years, codes)
/>`,
};
