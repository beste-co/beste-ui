import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "wave-gradient",
  title: "Wave Gradient",
  description:
    "A live WebGL gradient of layered color bands: two to nine ribbons stacked across the frame at an angle, each edge a pair of slow sine swells that roll at its own pace, blended softly into the next band in Oklab so every seam stays clean and bright. A shade under each edge makes the ribbons read as layered, a soft crest of light runs along them, and a fine film grain sits on top. Colors, angle, band count, amplitude, frequency, speed, softness, glow, depth, saturation, grain and seed are all props; new colors fade through and a new wave shape eases in over a set time, and the bands lift into a soft swell under the cursor. It rises softly out of its first color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a stepped CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { WaveGradient } from "@/components/beste/component/wave-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <WaveGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Pale, level ribbons with theme tokens
<WaveGradient
  className="min-h-[32rem]"
  colors={["var(--background)", "#ffd9c7", "#ff9b85", "var(--primary)"]}
  angle={0}
  bands={4}
  amplitude={0.3}         // gentle swells
  softness={0.7}          // hazy seams
  glow={0.2}
/>`,
};
