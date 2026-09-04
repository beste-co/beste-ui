import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text5",
  title: "Scroll Highlight",
  description:
    "A passage whose words brighten one after another in reading order as it scrolls through the viewport, and dim again on the way back, like a finger following the line.",
  category: "Text",
  dependencies: ["framer-motion"],
  usage: `import { Text5 } from "@/components/beste/component/text5";

<Text5
  as="p"
  text="Progress rarely feels like progress while it is happening. Sometimes it is showing up."
  dim={0.2}                         // opacity before the reader reaches a word
  className="font-serif text-5xl leading-[1.15]"
/>`,
};
