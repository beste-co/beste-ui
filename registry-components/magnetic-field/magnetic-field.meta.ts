import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "magnetic-field",
  title: "Magnetic Field",
  description:
    "A Canvas 2D field of iron filings that swing along the curved lines between two drifting magnetic poles. The cursor takes over the lead pole, spring physics pull the filings toward it, and a click or tap sends a radial shockwave through the grid; left alone the field pulses on its own. Ink and paper colors, spacing, filing length and weight, contrast, stiffness, pole strength, the second pole, shockwave, pulse interval and speed are all props. The filing count adapts to the device, it pauses offscreen and settles into one still frame for reduced motion.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { MagneticField } from "@/components/beste/component/magnetic-field";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <MagneticField className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<MagneticField
  className="min-h-[32rem]"
  inkColor="var(--primary)"      // any CSS color, tokens included
  spacing={18}                   // denser grid, in pixels
  length={0.8}                   // longer needles, 0 to 1
  secondPole={false}             // one pole only: a radial field
  pulseInterval={0}              // no pulses on its own
/>`,
};
