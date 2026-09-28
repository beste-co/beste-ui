import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "orb-gradient",
  title: "Orb Gradient",
  description:
    "A live WebGL gradient planet: one soft sphere whose surface carries a color ramp in latitude bands that fold and swirl slowly as it turns, lit from one side with a wrapped terminator, a luminous rim along its edge and an atmosphere that glows into the space around it. The palette is blended in Oklab, the rim and halo take its lightest color, and a film grain sits over the frame. Colors, base, size, position (including off frame, for a rising horizon), glow, rim, swirl, light angle, speed, saturation and grain are all props; a new palette fades through over a set time, and the light and the turn lean softly toward the cursor. It rises and grows softly out of its base color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS sphere without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { OrbGradient } from "@/components/beste/component/orb-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <OrbGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A huge planet rising from the bottom edge
<OrbGradient
  className="min-h-[32rem]"
  colors={["#0b2a4a", "#1f6fb2", "#7fd1e8", "#e9f7ff"]}
  size={2.6}
  positionY={1.95}          // center far below the frame, only the top arc shows
  glow={0.8}
  lightAngle={90}
/>`,
};
