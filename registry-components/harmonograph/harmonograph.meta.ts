import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "harmonograph",
  title: "Harmonograph",
  description:
    "A live Canvas 2D harmonograph: two damped pendulums over a slowly turning table draw one fine ink line into a rosette, and each finished figure rests briefly, fades away completely and only then gives way to the next, one figure at a time. The plate sways gently in 3D and leans toward the cursor; a click starts a new figure. Ink and paper, pace, pause between figures, line width and strength, damping, table spin, complexity, tilt and plate shape are all props. It pauses offscreen and shows a finished figure for reduced motion.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { Harmonograph } from "@/components/beste/component/harmonograph";

<Harmonograph className="aspect-square w-full max-w-[560px]" />

<Harmonograph
  className="aspect-square w-full max-w-md"
  inkColor="var(--primary)"   // any CSS color, tokens included
  duration={8}                // seconds per figure
  hold={0.4}                  // rest before the next figure starts
  complexity={0.9}            // more intricate ratios
  spin={0.2}                  // a calmer table
  tilt={0.8}                  // stronger sway and lean
  round={false}               // square sheet instead of a round plate
/>`,
};
