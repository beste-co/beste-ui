import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "liquid-chrome",
  title: "Liquid Chrome",
  description:
    "A live WebGL background of liquid chrome: slow folding metal with a rainbow film on its edges that swells toward the cursor. Colors, speed, fold size, film, pull, grain and vignette are all props. Adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to a CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { LiquidChrome } from "@/components/beste/component/liquid-chrome";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <LiquidChrome className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Or wrapping content, with its own look
<LiquidChrome
  className="min-h-[32rem]"
  shadowColor="var(--foreground)"   // any CSS color, tokens included
  highlightColor="#f4d7b0"
  iridescence={0.4}                 // 0 to 1
  hue={0.2}                         // shifts the rainbow film
  speed={0.6}                       // 1 is the default pace
  scale={2.2}                       // more, smaller folds
  pull={0.8}                        // swell under the cursor, 0 to 1
>
  <h2>...</h2>
</LiquidChrome>`,
};
