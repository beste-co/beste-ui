import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "pool-caustics",
  title: "Pool Caustics",
  description:
    "A live WebGL pool floor: pale hand-laid tiles and a lane mark bent by the water, sun-dappled caustic light drifting across them with a faint rainbow edge, and ripple rings that spread from the cursor, taps and the occasional drop. Tile, grout, lane, water and light colors, tile size, caustic strength and scale, refraction, color split, speed, ripples and rain are all props. It grows softly out of its tile color on load, the resolution adapts to the device, it pauses offscreen, holds a still frame for reduced motion and falls back to a tiled CSS grid without WebGL.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "plain",
  dependencies: [],
  usage: `import { PoolCaustics } from "@/components/beste/component/pool-caustics";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <PoolCaustics className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<PoolCaustics
  className="min-h-[32rem]"
  tileColor="#f4efe6"     // any CSS color
  laneColor="#b8452c"
  tileSize={12}           // tiles across the height
  caustics={0.9}          // brighter light, 0 to 1
  refraction={0.8}        // the water bends the grid more
  rain={0}                // no ripples on their own
/>`,
};
