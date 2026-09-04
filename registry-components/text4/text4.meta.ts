import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text4",
  title: "Turning Word",
  description:
    "A sentence whose one word takes turns: each candidate blurs up into place as the last blurs out, on a timer that stops when reduced motion is preferred.",
  category: "Text",
  dependencies: ["framer-motion"],
  usage: `import { Text4 } from "@/components/beste/component/text4";

<Text4
  as="h1"
  before="Room to"
  words={["breathe.", "think.", "rest.", "begin again."]}
  interval={2800}                      // ms per word
  className="font-serif text-7xl"
  wordClassName="text-muted-foreground"
/>`,
};
