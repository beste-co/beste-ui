import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "murmuration",
  title: "Murmuration",
  description:
    "A starling murmuration at dusk on Canvas 2D: thousands of birds fly as one dark cloud that folds, stretches, splits and rejoins like a living ink blot, following real flocking rules over a slow dusk sky. Where the flock folds it reads darker, where it thins it turns translucent. The cursor is a hawk: birds flee it and the panic travels through the flock as a wave before it closes again. Sky and bird colors, flock size, bird size, speed, cohesion, alignment, separation, wander and the hawk are all props. The bird count adapts to the device, it pauses offscreen and holds a still flock for reduced motion.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { Murmuration } from "@/components/beste/component/murmuration";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <Murmuration className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<Murmuration
  className="min-h-[32rem]"
  birds={2400}             // flock size, 200 to 2600
  skyTop="#1f2640"         // any CSS color
  skyHorizon="#f0a878"
  cohesion={0.7}           // a tighter, darker cloud
  wander={0.8}             // roams further and reshapes more
  hawk={0.9}               // flees the cursor harder
  hawkRadius={180}         // in pixels
/>`,
};
