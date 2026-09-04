import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text3",
  title: "Letter Cascade",
  description:
    "Short text whose characters arrive one by one out of a light blur, for eyebrows, labels and single words. The element keeps the whole string as its accessible name.",
  category: "Text",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Text3 } from "@/components/beste/component/text3";

<Text3
  as="p"
  text="Therapy and coaching, Lisbon"
  className="text-sm uppercase tracking-[0.25em] text-muted-foreground"
/>

<Text3 text="Altair" as="span" trigger="mount" stagger={0.05} className="font-serif text-6xl" />`,
};
