import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "dune-field",
  title: "Dune Field",
  description:
    "A photoreal desert at golden hour, raymarched in a WebGL shader. Dunes rise on a long windward slope to a sharp crest and fall away on a steep lee face, their crest lines curving across a broad swell of land. A low sun rakes across them: lee faces fall into soft shadow tinted by the sky, fine wind ripples catch the light, quartz grains glint, and the distance fades into a warm haze that carries the sun's glow. The camera glides slowly over the dunes and turns gently with the cursor, and on arrival the light comes up out of the dusk. Sand, sky, haze and sun colors, sun height and angle, dune size and ripples are all props. Pauses offscreen and adapts its resolution to keep the glide smooth. Reduced motion shows a still view.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "light",
  dependencies: [],
  usage: `import { DuneField } from "@/components/beste/component/dune-field";

<DuneField className="h-[40rem]" />

<DuneField
  sandColor="#c98f5a"
  skyColor="#5f7fb0"
  sunHeight={0.12}   // a lower sun, longer shadows
  sunAngle={40}      // light from the right
  scale={1.3}        // bigger dunes
  className="absolute inset-0"
/>`,
};
