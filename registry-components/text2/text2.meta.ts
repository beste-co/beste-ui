import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text2",
  title: "Line Reveal",
  description:
    "Lines of text that rise into view out of their own clipped rows, one after another, the way a heading is unmasked line by line.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text2 } from "@/components/beste/component/text2";

<Text2
  as="h2"
  lines={["Nothing changes all at once.", "Everything changes a little at a time."]}
  className="font-serif text-5xl leading-[1.05]"
/>

<Text2
  as="h1"
  lines={["Come as you are.", "Stay as long as it takes."]}
  trigger="mount"
  stagger={0.18}
/>`,
};
