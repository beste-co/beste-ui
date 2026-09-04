import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text14",
  title: "Letters Settling",
  description:
    "A short word whose letters begin scattered and slightly turned, then drift home on a soft spring one after another, like type settling onto a page.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text14 } from "@/components/beste/component/text14";

<Text14 as="h1" text="settle" className="font-serif text-9xl" />

<Text14
  text="Altair"
  spread={1.4}        // how far the letters start from home, in em
  stagger={0.08}
  trigger="mount"
/>`,
};
