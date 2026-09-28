import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "reeded-light",
  title: "Reeded Light",
  description:
    "A live WebGL background of light seen through reeded glass: a procedural field with a glow pooled at the source corner, a broad haze and a narrow accent band slowly bends behind a row of rounded glass reeds, each magnifying and tipping its own slice, with soft seams, shaded flanks, a fine glint and static film grain. A warm lamp behind the glass follows the cursor. Colors, light direction, band position, reed width, magnification, shading, grain, speed, lamp and a readability veil are all props. Adapts its resolution, pauses offscreen, holds a still frame for reduced motion and shows the same light as a CSS gradient before the canvas is ready or without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { ReededLight } from "@/components/beste/component/reeded-light";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <ReededLight className="absolute inset-0" veilX={0.3} veilY={0.7} veil={0.4} />
  <div className="relative">...</div>
</section>

<ReededLight
  className="min-h-[32rem]"
  groundColor="#0b0a08"   // any CSS color, tokens included
  glowColor="#f4e6c8"
  hazeColor="#2f5a4a"
  accentColor="#f2a33a"
  angle={120}             // the light runs from the top right toward the bottom left
  band={0.58}             // where the bright band crosses
  reedWidth={24}          // narrower reeds, in CSS pixels
  magnify={0.8}           // stronger lenses
/>`,
};
