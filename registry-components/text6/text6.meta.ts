import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text6",
  title: "Typewriter",
  description:
    "Text typed out one character at a time behind a thin caret that keeps a slow pulse once the line is finished. The element keeps the whole string as its accessible name.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text6 } from "@/components/beste/component/text6";

<Text6
  as="h2"
  text="Come as you are."
  speed={45}          // ms per character
  delay={200}         // ms before the first one
  caret              // keep the caret after the last character
  className="font-serif text-5xl"
/>`,
};
