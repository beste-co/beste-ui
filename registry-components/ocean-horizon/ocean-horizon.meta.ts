import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ocean-horizon",
  title: "Ocean Horizon",
  description:
    "A live WebGL background of the open sea at dusk, rendered like a calm cinematic photograph: summed swell and ripple waves with sharpened crests, Fresnel sky reflections, a sun glitter path that widens toward the horizon, light glowing through the crests, aerial haze on the distance, thin high clouds and a camera that rides the swell and turns gently toward the cursor. Sky, sun and water colors, sun height and position, wave size, crest sharpness, glitter, haze, clouds and speed are all props. The scene rises softly out of a plain sky on load; it adapts its resolution and wave detail, pauses offscreen, holds a still frame for reduced motion and shows the same scene as a CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { OceanHorizon } from "@/components/beste/component/ocean-horizon";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <OceanHorizon className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Bright late afternoon on a livelier sea
<OceanHorizon
  className="min-h-[32rem]"
  skyTop="#3d6fa8"      // any CSS color, tokens included
  skyHorizon="#dfe6ea"
  sunColor="#fff4dc"
  waterColor="#0d3348"
  sunHeight={0.6}       // 0 is just set, 1 is high afternoon
  sunX={0.4}
  waves={0.8}
  choppiness={0.7}
  clouds={0.2}
/>`,
};
