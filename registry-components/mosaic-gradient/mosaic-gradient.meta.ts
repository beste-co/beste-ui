import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "mosaic-gradient",
  title: "Mosaic Gradient",
  description:
    "A live WebGL gradient set in tiles: a soft, flowing multi-color gradient is sampled once per tile, so the frame reads as a grid of rounded, glazed tiles in grout, each with a beveled edge, a small shadow and its own slow glint, while broad waves of light pass across the grid and gently lift the tiles they cross. Colors blend in Oklab. Colors, grout color, tile count, gap, rounding, shimmer, depth, wave strength, speed, saturation and grain are all props; a new palette fades through over a set time, and tiles near the cursor lift and brighten softly. The tiles grow in one by one from the center on load, it adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS blend without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { MosaicGradient } from "@/components/beste/component/mosaic-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <MosaicGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Fine, round pixels on a light grout
<MosaicGradient
  className="min-h-[32rem]"
  colors={["#ffd6e0", "#c9e4ff", "#b8f2d8", "#fff1b8"]}
  backgroundColor="#fbf8f3"
  cells={48}
  gap={0.22}
  radius={1}               // round tiles
  depth={0.2}
/>`,
};
