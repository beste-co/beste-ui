import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text18",
  title: "Circle Text",
  description:
    "A line of text set around a circle that turns slowly, with room in the middle for an initial, an icon or a short word. A seal for corners, footers and hero edges.",
  category: "Text",
  usage: `import { Text18 } from "@/components/beste/component/text18";

<Text18 text="Altair · Lisbon · since 2019 · " size={180} className="text-sm uppercase tracking-[0.3em]">
  <span className="font-serif text-3xl">A</span>
</Text18>

<Text18
  text="Book a first call · Book a first call · "
  size={140}
  duration={16}            // seconds per turn, 0 holds still
  direction="counter"
/>`,
};
