import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "fluid-gradient",
  title: "Fluid Gradient",
  description:
    "A live WebGL paint pour: a ramp of up to six colors, blended in Oklab, runs through layered fractal noise that warps itself twice, so the colors fold into marbled, swirling streams that drift slowly along a set direction like paint poured and gently stirred. Fine streaks run inside the streams, a soft gloss catches the folds and a film grain sits on top. Colors, scale, warp, detail, flow direction, stretch, ramp repeats, speed, contrast, sheen, saturation, grain amount and size, the seed and the cursor pull are all props; a new palette fades through over a set time, and the paint bends softly toward the cursor like a lens. It unfolds softly out of its first color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a plain CSS ramp without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { FluidGradient } from "@/components/beste/component/fluid-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <FluidGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Long, bold streams of sunset colors flowing upward
<FluidGradient
  className="min-h-[32rem]"
  colors={["#2a0f3d", "#c2185b", "#ff8a3d", "#ffe3b3"]}
  flow={90}
  stretch={0.8}
  contrast={0.8}
  repeat={2}               // the ramp mirrors twice across the paint
  transition={2}           // a new palette fades in over 2 seconds
/>`,
};
