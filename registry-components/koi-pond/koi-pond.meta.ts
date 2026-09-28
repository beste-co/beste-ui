import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "koi-pond",
  title: "Koi Pond",
  description:
    "A koi pond seen from above: kohaku, sanke, showa and golden koi swim with a flowing S-curve, trailing their fins and fluttering tails over a mottled green floor lit by drifting sunlight caustics, each casting a soft shadow below, while lily pads with a flower or two bob on the surface. The fish grow curious and circle the cursor, a click scatters food and sends ripple rings across the water, and now and then a koi breaks the surface for a breath. Fish count, varieties, water color, lily pads, caustics, ripples, curiosity and pace are props. It pauses offscreen, holds a still pond for reduced motion and keeps swimming on a flat floor without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { KoiPond } from "@/components/beste/component/koi-pond";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <KoiPond className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<KoiPond
  className="min-h-[32rem]"
  fish={9}                 // 1 to 12 koi
  palette="golden"         // "mixed" (default) | "kohaku" | "golden"
  waterColor="#12312d"     // the pond floor, any CSS color
  curiosity={0.9}          // how readily they gather at the cursor, 0 to 1
  lilyPads={false}
/>`,
};
