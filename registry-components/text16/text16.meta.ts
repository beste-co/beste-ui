import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text16",
  title: "Highlight Sweep",
  description:
    "An inline phrase that gets a soft highlight swept in behind it from the left when it scrolls into view, like a marker drawn across the words, without the text moving.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text16 } from "@/components/beste/component/text16";

<h2 className="font-serif text-5xl">
  A practice where you are <Text16 text="listened to" />, all the way through.
</h2>

<Text16 text="on purpose" highlightClassName="bg-primary/20" delay={0.6} />`,
};
