import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "star-trails",
  title: "Star Trails",
  description:
    "A live WebGL background of a long-exposure night photograph: thousands of stars drawn analytically as continuous, anti-aliased arcs around a celestial pole, each with its own brightness and colour temperature from blue-white to orange. The exposure builds up over the first seconds like a real shutter left open, then the sky keeps turning slowly with a soft comet fade on every trail. Airglow lifts the sky toward the horizon over layered ridges and an optional pine forest line, finished with lens vignetting and fine sensor noise. The land and the pole shift slightly with the cursor for depth. Colours, star density, trail length, pole position, horizon height, foreground, grain and speed are props, and a progress prop can drive the exposure from scroll. Grows softly out of the sky color on load, adapts its resolution, pauses offscreen, holds the full exposure for reduced motion and falls back to a CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { StarTrails } from "@/components/beste/component/star-trails";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <StarTrails className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<StarTrails
  className="min-h-[32rem]"
  skyColor="#060510"      // any CSS color, tokens included
  glowColor="#2a1e3a"
  horizonColor="#d08040"
  exposure={0.8}          // longer trails
  poleX={0.5}
  poleY={0.3}             // the pole inside the frame draws full circles
  silhouette="ridges"     // "forest", "ridges" or "none"
/>`,
};
