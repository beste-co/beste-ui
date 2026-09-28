import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "text21",
  title: "Particle Type",
  description:
    "Text drawn as thousands of particles sampled from its own font and layout on a Canvas 2D layer. Particles fly into the letters, scatter and swirl away from the cursor, take an accent color while they move and shimmer at rest; a slow ghost pointer keeps them alive on touch screens. Density, size, colors, push, reach, spring, swirl and shimmer are props. The real text stays in the page for screen readers and search, the particle count adapts to the device, it pauses offscreen and settles into still letters for reduced motion.",
  category: "Text",
  isAnimated: true,
  dependencies: [],
  usage: `import { Text21 } from "@/components/beste/component/text21";

<Text21
  as="h1"                  // "h1" | "h2" | "h3" | "p" | "span"
  text="Every letter, loose."
  className="text-9xl font-semibold tracking-[-0.04em]"
/>

<Text21
  text="Push it around."
  color="currentColor"          // follows the text color; any CSS color or token
  accentColor="var(--primary)"  // color while particles move
  density={0.7}                 // finer sampling, 0 to 1
  force={0.8}                   // harder scatter, 0 to 1
  reach={220}                   // radius around the cursor, in pixels
  idle={false}                  // no ghost pointer when nobody is pointing
/>`,
};
