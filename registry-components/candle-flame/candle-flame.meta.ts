import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "candle-flame",
  title: "Candle Flame",
  description:
    "A single candle flame drawn live in WebGL on a dark, warm ground: a teardrop with a blue base, a white-gold core and an orange mantle, a slow flicker, warm light breathing on the room and the wax, and a thin wisp of smoke that curls up now and then. The cursor is a breath that bends the flame away, and a quick pass makes it gutter for a moment. Colors, candle, flicker, sway, smoke, glow, breath, position and size are all props. Pauses offscreen, holds a still flame for reduced motion and falls back to a soft glow without WebGL.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { CandleFlame } from "@/components/beste/component/candle-flame";

<CandleFlame className="aspect-[4/5] w-full max-w-md" />

<CandleFlame
  className="h-[36rem]"
  groundColor="#0b0908"     // any CSS color, tokens included
  flameColor="#ffb45c"
  waxColor="#f2e8d8"
  position={0.7}            // candle toward the right, 0 to 1
  flicker={0.3}             // calmer flame, 0 to 1
  smoke={0}                 // no smoke wisps
  breath={0.9}              // the cursor bends it further
/>`,
};
