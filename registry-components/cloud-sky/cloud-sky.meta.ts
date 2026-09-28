import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "cloud-sky",
  title: "Cloud Sky",
  description:
    "A live WebGL flight through golden-hour cumulus: up to four layers of billowy clouds drift past at different speeds, sunlit on the side facing a low sun, soft gray beneath, with a silver lining where thin edges catch the light and far layers fading into the horizon haze. The cursor steers the view a little. Sky colors, sun color and position, coverage, softness, speed and layers are all props. Clouds condense softly out of clear sky on load, it renders at a reduced, adaptive resolution, pauses offscreen, holds a still sky for reduced motion and falls back to a CSS sky without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { CloudSky } from "@/components/beste/component/cloud-sky";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <CloudSky className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<CloudSky
  className="min-h-[32rem]"
  skyTop="#3d4f7a"       // any CSS color, tokens included
  skyHorizon="#f7b88a"
  sunX={0.3}             // sun position, 0 to 1
  sunY={0.25}
  coverage={0.7}         // more of the sky under cloud
  softness={0.8}         // mistier edges
  layers={3}             // depth layers, 1 to 4
/>`,
};
