import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "split-flap",
  title: "Split-Flap Board",
  description:
    "A departure board of CSS 3D split-flap characters that flick through random glyphs before settling on each phrase, rippling across the columns and cycling through a list. Columns, rows, timing, flip count, ripple, capitals and the flap, ink and split colors are props. Transforms only from one loop that sleeps between phrases; it pauses offscreen and shows the first phrase still for reduced motion.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  dependencies: [],
  usage: `import { SplitFlap } from "@/components/beste/component/split-flap";

<div className="rounded-2xl bg-[#121211] p-6">
  <SplitFlap phrases={["Sleep in Paris, wake in Vienna", "Lisbon to Madrid, 22:05"]} />
</div>

<SplitFlap
  phrases={["Now boarding", "Platform 4"]}
  columns={12}          // characters per row
  interval={4000}       // milliseconds per phrase
  flips={3}             // random glyphs before each character settles
  stagger={0.8}         // a slower ripple across the board
  flapColor="#1b2a3a"
  inkColor="#ffd166"
/>`,
};
