import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "frosted-gradient",
  title: "Frosted Gradient",
  description:
    "A live WebGL pane of frosted glass with color drifting behind it: soft round shapes and rounded bars in up to six colors float slowly on the far side, blurred by the glass into a gradient, while a fine sandblasted tooth scatters the view, the edges of the pane bend the light with a thin highlight and optional vertical flutes press into the surface. Colors blend in Oklab under a fine film grain. Colors, background, shape count and size, blur, frost, bevel, flutes, speed, saturation and grain are all props; a new palette fades through over a set time, and the first shape glides after the cursor behind the glass. It grows softly out of its background color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to soft CSS color pools without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  demoContentTone: "plain",
  usage: `import { FrostedGradient } from "@/components/beste/component/frosted-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <FrostedGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A dark, fluted pane over three deep colors
<FrostedGradient
  className="min-h-[32rem]"
  colors={["#ff4f3a", "#3a5bff", "#ffb13a"]}
  backgroundColor="#0e0f14"
  shapes={4}
  blur={0.8}
  frost={0.7}
  flutes={18}              // vertical reeds pressed into the glass
/>`,
};
