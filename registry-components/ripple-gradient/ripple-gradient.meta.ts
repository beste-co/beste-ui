import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ripple-gradient",
  title: "Ripple Gradient",
  description:
    "A live WebGL ripple gradient: concentric rings spread from a few slowly wandering points like drops on still water, each ring carrying the next color of the palette outward, blended in Oklab over a calm base color. Where rings from different sources meet they reinforce and cancel, and they fade with distance. Colors, base, source count, ring density, speed, softness, decay, interference, intensity, saturation and film grain are all props and a new palette fades through over a set time. On load the rings spread out of the flat base; it adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to CSS rings without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  demoContentTone: "theme",
  usage: `import { RippleGradient } from "@/components/beste/component/ripple-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <RippleGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Fine, crisp rings on a dark pool
<RippleGradient
  className="min-h-[32rem]"
  colors={["#7ee0d1", "#4c8dff", "#c7b8ff"]}
  baseColor="#0a1420"
  sources={4}
  frequency={0.8}          // tighter rings
  softness={0.2}           // thin, crisp lines
  interference={0.8}
/>`,
};
