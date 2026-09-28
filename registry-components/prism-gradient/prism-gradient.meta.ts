import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "prism-gradient",
  title: "Prism Gradient",
  description:
    "A live WebGL gradient of light split through a prism: a thin white beam enters from one side and leaves as a few soft fans of dispersed color, each running its palette edge to edge, with caustic streaks flowing along the beams, a slow sway and a bloom around the prism. The fans can use a custom palette, a physical rainbow or any mix of the two; dark bases glow, light bases take the light as a tint. Colors, spectrum mix, base color, beam count, spread, angle, prism position, bloom, sharpness, caustics, the white beam, speed, saturation and film grain are all props, and a new palette fades through over a set time; the prism eases a little toward the cursor. On load the beams reach out of the flat base color over 2.4 seconds. It adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS color fan without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { PrismGradient } from "@/components/beste/component/prism-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <PrismGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A pure rainbow fanning upward on a warm paper base
<PrismGradient
  className="min-h-[32rem]"
  baseColor="#f4efe6"
  spectrum={1}             // a physical rainbow
  beams={1}
  spread={0.8}
  angle={70}
  sourceX={0.5}
  sourceY={0.15}
/>`,
};
