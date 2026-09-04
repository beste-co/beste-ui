import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text8",
  title: "Underline Draw",
  description:
    "An inline phrase whose hairline underline draws itself in from the left when it scrolls into view. Drop it inside a heading or a sentence to mark the words that matter.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text8 } from "@/components/beste/component/text8";

<h2 className="font-serif text-5xl">
  A practice where you are <Text8 text="listened to the end" />.
</h2>

<Text8
  text="in the room or online"
  offset={0.25}            // gap under the text, in em
  thickness={2}            // line thickness in px
  lineClassName="bg-primary"
  delay={0.5}
/>`,
};
