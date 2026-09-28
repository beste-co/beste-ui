import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ink-flow",
  title: "Ink Flow",
  description:
    "A generative Canvas 2D background where thousands of fine ink strokes follow a slowly turning current, fade back into the paper and are drawn again, gathering into heavier brush lines around the cursor. Ink and paper colors, density, speed, swirl, trail, weight, opacity, the side the ink gathers on and the brush are all props. Ink and paper follow the theme by default, the stroke count adapts to the device, it pauses offscreen and holds a still drawing for reduced motion.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { InkFlow } from "@/components/beste/component/ink-flow";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <InkFlow className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<InkFlow
  className="min-h-[32rem]"
  inkColor="var(--primary)"      // any CSS color, tokens included
  paperColor="var(--background)"
  density={0.7}                  // how many strokes, 0 to 1
  swirl={0.8}                    // tight eddies instead of long sweeps
  trail={0.3}                    // strokes fade sooner
  gather="left"                  // "right" (default) | "left" | "center" | "none"
/>`,
};
