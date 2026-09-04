import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text12",
  title: "Slow Wave",
  description:
    "A word whose letters rise and fall on one slow, continuous swell, each a beat behind the last, like a line of type resting on water. Stays still when reduced motion is preferred.",
  category: "Text",
  dependencies: ["framer-motion"],
  usage: `import { Text12 } from "@/components/beste/component/text12";

<Text12 as="h1" text="Altair" className="font-serif text-9xl" />

<Text12
  text="breathe"
  amplitude={0.12}   // wave height in em
  period={6}         // seconds per swell
/>`,
};
