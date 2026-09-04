import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text19",
  title: "Strike and Replace",
  description:
    "A sentence that corrects itself: a line is drawn through the old word from left to right, and the better word settles in beside it out of a soft blur.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text19 } from "@/components/beste/component/text19";

<Text19
  as="h2"
  before="Not"
  struck="fixed."
  replacement="heard."
  struckClassName="text-muted-foreground"
  className="font-serif text-6xl"
/>

<Text19 before="Slow" struck="change." replacement="change, on purpose." trigger="mount" delay={0.6} />`,
};
