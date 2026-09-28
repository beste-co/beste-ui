import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "fold-gradient",
  title: "Fold Gradient",
  description:
    "A live WebGL pleated gradient: a smooth multi-color gradient printed across a sheet that is folded like an accordion, blended in Oklab. Every pleat has a lit face and a shaded face from a movable light, soft shadow in the valleys and a thin highlight along the ridges, and the sheet breathes as a slow swell opens and closes the folds while a gentle sway travels down each pleat. Colors, base, fold count, depth, pleat angle, light angle, breathing, sway, sheen, gradient direction, speed, saturation and film grain are all props, and a new palette fades through over a set time. The pleats under the cursor ease open and the light leans toward it. It unfolds softly out of its base color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to CSS pleat stripes without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  demoContentTone: "soft",
  usage: `import { FoldGradient } from "@/components/beste/component/fold-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <FoldGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Fine horizontal pleats in a cool palette, lit from above
<FoldGradient
  className="min-h-[32rem]"
  colors={["#0f2a4a", "#2f6fd6", "#9fd3ff", "#f4f1ea"]}
  baseColor="#0f2a4a"
  folds={26}
  angle={0}              // pleats run left to right
  lightAngle={90}
  depth={0.7}
/>`,
};
