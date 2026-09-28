import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "bokeh-gradient",
  title: "Bokeh Gradient",
  description:
    "A live WebGL field of out-of-focus light: soft discs of varying size drift upward over a gentle wash of the palette, each with the soft interior and slightly brighter rim of real lens bokeh, near discs larger and brighter than far ones. The discs can take the polygon shape of the aperture blades, the focus goes from dreamy to crisp, and the depth layers shift with parallax toward the cursor. Colors, background, count, size, focus, aperture, blades, brightness, wash, speed, depth, saturation and film grain are all props, and a new palette fades through over a set time. It grows softly out of its background on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to soft CSS circles without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { BokehGradient } from "@/components/beste/component/bokeh-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <BokehGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Crisp hexagonal city lights
<BokehGradient
  className="min-h-[32rem]"
  colors={["#ffd28a", "#ff8a5c", "#f6f1e7"]}
  backgroundColor="#120d0a"
  focus={0.8}
  aperture={1}             // the polygon of the aperture blades
  blades={6}
  count={32}
/>`,
};
