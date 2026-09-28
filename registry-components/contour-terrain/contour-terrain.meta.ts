import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "contour-terrain",
  title: "Contour Terrain",
  description:
    "A live WebGL survey map: crisp contour lines drift slowly across hill-shaded ground, with heavier index contours every fifth level, summits touched with the accent color and lines that swell softly around the cursor. Tilt runs from the map seen straight from above to a map laid back into the distance, where the lines thin out and fade into the paper. Rises softly out of the paper on load, adapts its resolution, pauses offscreen, holds a still view for reduced motion and falls back to CSS rings without WebGL.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { ContourTerrain } from "@/components/beste/component/contour-terrain";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <ContourTerrain className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<ContourTerrain
  className="min-h-[32rem]"
  inkColor="var(--foreground)"    // any CSS color, tokens included
  accentColor="var(--primary)"    // summits
  tilt={0.9}                      // 0 flat map from above, 1 low view across the land
  relief={0.8}                    // deeper light and shade on the slopes
  lines={30}                      // more contour levels
  haze={0.3}                      // see further before the land fades
/>`,
};
