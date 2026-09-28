import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "sun-blinds",
  title: "Sun Through Blinds",
  description:
    "A live WebGL wall of warm afternoon light falling through venetian blinds: slat shadows that soften with distance and sway in a slow breeze, a window mullion, the blurred shadow of a potted plant, dust drifting through a faint beam and plaster grain, with the sun shifting a little toward the cursor. Wall and light colors, slat count, softness, sway, leaves, dust, follow and speed are props. Grows softly out of the wall color on load, adapts its resolution, pauses offscreen, holds a still frame for reduced motion and falls back to a striped CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "plain",
  dependencies: [],
  usage: `import { SunBlinds } from "@/components/beste/component/sun-blinds";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <SunBlinds className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<SunBlinds
  className="min-h-[32rem]"
  wallColor="#c9d3cf"     // any CSS color, tokens included
  lightColor="#fff1d6"
  slats={16}              // more, thinner slats
  softness={0.8}          // softer slat edges
  sway={0.2}              // a quieter breeze
  leaves={false}          // no plant shadow
  dust={0.8}              // more dust in the beam
/>`,
};
