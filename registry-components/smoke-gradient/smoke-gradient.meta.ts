import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "smoke-gradient",
  title: "Smoke Gradient",
  description:
    "A live WebGL gradient of colored smoke: soft plumes rise from the bottom edge, widen as they climb, curl through a fractal flow and thin out near the top, over a low haze along the floor. The smoke is colored by a gradient ramp from the base of each plume to its tip, blended in Oklab, under a fine film grain. Colors, base, density, plume count, height, rise speed, curl, softness, scale, saturation, grain and seed are all props; a new palette fades through over a set time, and the smoke parts gently around the cursor. It grows softly out of its base on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to soft CSS plumes without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { SmokeGradient } from "@/components/beste/component/smoke-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <SmokeGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Pale incense on a light page
<SmokeGradient
  className="min-h-[32rem]"
  baseColor="#f4f1ec"
  colors={["#d9d2c8", "#b7a6c9", "#8f7fb0"]}
  plumes={1}
  curl={0.8}
  softness={0.8}
/>`,
};
