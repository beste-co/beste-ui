import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "aurora-sky",
  title: "Aurora Sky",
  description:
    "A live WebGL night sky with folding northern-lights curtains, vertical rays, a sparse twinkling starfield and two mountain ridges along the bottom. The curtains lean with the cursor like wind. Sky, curtain and mountain colors, brightness, curtain count and height, ray detail, stars, twinkle, speed and wind are all props. Grows softly out of the sky color on load, renders at a reduced scale, adapts to the device, pauses offscreen, holds a still sky for reduced motion and falls back to a CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { AuroraSky } from "@/components/beste/component/aurora-sky";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <AuroraSky className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<AuroraSky
  className="min-h-[32rem]"
  lowColor="#7df9ff"      // any CSS color, tokens included
  highColor="#6d5bff"
  intensity={0.7}         // brightness, 0 to 1
  curtains={3}            // 1 to 4
  rays={0.8}              // sharper vertical rays
  mountains={false}       // open horizon
/>`,
};
