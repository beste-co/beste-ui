import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "op-art",
  title: "Op Art Field",
  description:
    "A live WebGL background of dense parallel lines in the spirit of Bridget Riley: they ripple in slow waves, swell from hairline to heavy across the field and bulge around the cursor or a wandering focus. Ink and paper colors, line count, angle, wave, weight, contrast, speed and pull are all props. Lines stay crisp at any size, the resolution adapts to the device, it pauses offscreen, holds a still frame for reduced motion and falls back to CSS stripes without WebGL.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { OpArt } from "@/components/beste/component/op-art";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <OpArt className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<OpArt
  className="min-h-[32rem]"
  inkColor="var(--primary)"      // any CSS color, tokens included
  paperColor="var(--background)"
  lines={48}                     // lines across the height
  angle={-12}                    // rotation, in degrees
  wave={0.8}                     // ripple, 0 to 1
  weight={0.3}                   // average thickness, 0 to 1
  contrast={0.9}                 // thin to heavy swing, 0 to 1
/>`,
};
