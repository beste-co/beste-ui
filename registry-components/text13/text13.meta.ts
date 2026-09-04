import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text13",
  title: "Fog Clearing",
  description:
    "Text hidden behind fog that clears across it from left to right along one soft edge, so the words emerge in reading order without moving at all.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text13 } from "@/components/beste/component/text13";

<Text13 as="h2" text="The fog lifts a little later each morning." className="font-serif text-5xl" />

<Text13
  as="p"
  text="Come as you are, stay as long as it takes."
  softness={50}      // width of the soft edge, percent
  duration={3}
  trigger="mount"
/>`,
};
