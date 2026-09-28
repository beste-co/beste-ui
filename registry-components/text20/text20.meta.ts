import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text20",
  title: "Repel Letters",
  description:
    "Heavy type whose letters drop in one by one, then spring away from the cursor with a slight lean and stretch before settling back. Push, reach, lean, stretch and springiness are props. Resting positions are measured once, so a move reads a single box, not one per letter.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  dependencies: ["framer-motion"],
  usage: `import { Text20 } from "@/components/beste/component/text20";

<Text20
  as="h1"                  // "h1" | "h2" | "h3" | "p" | "span"
  text="Loud type, strict grid."
  className="text-8xl font-semibold tracking-[-0.06em]"
/>

<Text20
  text="Keep your distance."
  force={0.8}      // how far letters are pushed, 0 to 1
  reach={320}      // radius around the cursor, in pixels
  tilt={0.3}       // lean, 0 to 1
  stretch={0.7}    // upward stretch, 0 to 1
  bounce={0.8}     // lively wobble on the way back
  entrance={false} // skip the drop-in
/>`,
};
