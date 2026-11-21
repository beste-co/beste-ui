import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "sky-gradient",
  title: "Sky Gradient",
  description:
    "A soft painted sky in code: a sky gradient from the top down, a warm haze rising from a lower corner, one or two banks of blurred cloud and loose puffs that drift slowly, under a fine film grain. Its opacity lets the page ground show through, lightening the sky on light themes and deepening it on dark ones. Ten looks come ready, from a blue dawn and a lilac dusk to a stone and a night sky. Every sky on a page shares one WebGL context and draws at a quarter of its size, so dozens can sit in cards without weighing the page down. Skies pause offscreen and in background tabs, hold still for reduced motion, show a CSS gradient until WebGL is ready, and keep their last frame if the browser drops the context, picking up again when it returns.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "plain",
  demoContentOff: true,
  dependencies: [],
  usage: `import { SkyGradient } from "@/components/beste/component/sky-gradient";

// Behind a card's content
<SkyGradient
  preset="dusk"   // dawn, haze, azure, dusk, mist, apricot, lilac, sage, stone, night
  className="rounded-3xl p-7"
>
  <div>...</div>
</SkyGradient>

// Tuned by hand
<SkyGradient
  colors={["#93b8e8", "#b7cfee", "#dfe0e6", "#f5e4d8"]}
  cloudX={0.7}
  cloudY={0.3}
  clouds={0.8}
  scatter={0.3}
  opacity={0.7}   // let the page ground through
  speed={2.5}
  className="aspect-5/4 w-full"
/>`,
};
