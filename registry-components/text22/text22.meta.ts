import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text22",
  title: "Trivision Type",
  description:
    "Type set on a trivision board: the statement is cut into vertical slats that are real 3D triangular prisms, and every few seconds they turn one after another in a wave to show the next statement, each printed on its own surface (paper, ink or accent). Faces darken as they turn away, and hairline seams drawn in difference sit over the slat joints, so every seam reads the same on paper, ink and accent. Pauses on hover and offscreen; with reduced motion the statement changes in place.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  dependencies: [],
  usage: `import { Text22 } from "@/components/beste/component/text22";

<Text22
  as="h1"
  faces={[
    { text: "Seen from across the street.", tone: "paper" },  // "paper" | "ink" | "accent"
    { text: "Read by someone in a hurry.", tone: "ink" },  // similar lengths wrap alike
    { text: "Remembered for years after.", tone: "accent" },
  ]}
  className="text-8xl font-semibold tracking-[-0.045em]"
/>

<Text22
  faces={[{ text: "Open late." }, { text: "Closed never.", tone: "ink" }]}
  slats={12}        // fewer, wider slats
  interval={4}      // seconds each statement holds
  stagger={0.06}    // a slower wave across the board
  seams={false}
/>`,
};
