import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "silk-drape",
  title: "Silk Drape",
  description:
    "A live WebGL length of silk hanging from a few pins along its top edge: real cloth physics (a mass-spring weave with shear and bending) lets it fall into deep folds and swell in a slow breeze, shaded with an anisotropic sheen that runs along the weave, a soft rim and occlusion in the folds. Sweeping the cursor across stirs the air: the silk ripples and swings in the direction of the movement, then settles; a still cursor leaves it alone. The fabric is far wider than the frame, so its edges never show however it gathers. Silk and background colors, sheen, light angle, stiffness, wind, pins and mesh detail are all props. It grows softly out of the background on load, the resolution adapts to the device, it pauses offscreen, hangs still for reduced motion and falls back to a CSS drape without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { SilkDrape } from "@/components/beste/component/silk-drape";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <SilkDrape className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<SilkDrape
  className="min-h-[32rem]"
  color="#d9c3a0"            // champagne; any CSS color, tokens included
  backgroundColor="#1a140d"
  sheen={0.9}                // brighter highlights along the weave, 0 to 1
  lightAngle={60}            // light from the upper right
  wind={0.7}                 // a stronger breeze
  pins={7}                   // shallower swags along the top
/>`,
};
