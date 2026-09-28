import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "conic-gradient",
  title: "Conic Gradient",
  description:
    "A live WebGL conic gradient glow: up to six colors sweep around a center point and slowly turn, blended in Oklab so each seam between two hues stays clean and bright. The sweep can repeat into several arms, bend into a spiral, soften its seams toward the center, breathe with a slow swell and ripple, and fade at its edge into a background color, reading as a full disc, a glowing ring or a sweep that fills the frame. A soft light can sit at the core and a film grain on top. Colors, background, center, repeats, angle, speed and direction, radius, ring, falloff, blur, twist, core, breathe, saturation and grain are all props; new colors fade through over a set time, radius, core, speed and center glide to new values, and the center leans toward the cursor. It grows softly out of its background on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS conic gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { ConicGradient } from "@/components/beste/component/conic-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <ConicGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A thin, three-armed ring turning counterclockwise
<ConicGradient
  className="min-h-[32rem]"
  colors={["var(--primary)", "#2fd4ff", "#ffb347"]}
  backgroundColor="var(--background)"
  repeat={3}
  ring={0.8}
  rotation={-1.5}
  radius={0.4}
  core={0}
/>`,
};
