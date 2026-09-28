import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "vortex-gradient",
  title: "Vortex Gradient",
  description:
    "A live WebGL whirlpool of color: up to six colors wound into a logarithmic spiral that turns and pulls toward its center, blended in Oklab so every mix stays clean. Fractal ripples fray the arms, the pit darkens as it falls away, and an optional bright eye glows at the heart, all under a fine film grain. Colors, base, arm count, tightness, spread, depth, turbulence, eye, center position, direction, speed, saturation and grain are all props; a new palette fades through over a set time, and the center leans gently toward the cursor. It grows softly out of its base color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS conic sweep without WebGL.",
  category: "Background",
  demoContentTone: "theme",
  isAnimated: true,
  dependencies: [],
  usage: `import { VortexGradient } from "@/components/beste/component/vortex-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <VortexGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A calm, sea-glass whirlpool filling the frame
<VortexGradient
  className="min-h-[32rem]"
  colors={["#0f3d3e", "#3fa7a0", "#c8f1e6", "#1c6e8c"]}
  baseColor="#061a1c"
  arms={5}
  tightness={0.8}
  spread={2}               // reaches past the frame edges
  eye={0}
  direction="counterclockwise"
/>`,
};
