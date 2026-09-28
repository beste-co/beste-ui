import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "warp-field",
  title: "Warp Field",
  description:
    "A Canvas 2D starfield streaming from a vanishing point that leans toward the cursor. Raise the warp prop and the stars ease into long hyperspace streaks while a soft tunnel glow opens; lower it and they settle back to a slow cruise. Space, star and glow colors, density, speed, streak length, glow, horizon and follow are all props. The stars fade in softly on load, the star count adapts to the device, it pauses offscreen and holds a still field for reduced motion.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { WarpField } from "@/components/beste/component/warp-field";
import { useState } from "react";

// Drive the warp from anything: a button hover, a scroll position, a timer
const [warp, setWarp] = useState(0);

<section className="relative min-h-[40rem]">
  <WarpField className="absolute inset-0" warp={warp} />
  <button
    onPointerEnter={() => setWarp(1)}
    onPointerLeave={() => setWarp(0)}
    className="relative"
  >
    Reserve a seat
  </button>
</section>

<WarpField
  className="min-h-[32rem]"
  spaceColor="#04050a"   // any CSS color, tokens included
  glowColor="#96afff"
  density={0.8}          // more stars, 0 to 1
  streaks={0.7}          // longer streaks at warp
  horizon={0.5}          // vanishing point height
/>`,
};
