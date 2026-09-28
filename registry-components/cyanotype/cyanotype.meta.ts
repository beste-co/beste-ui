import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "cyanotype",
  title: "Cyanotype",
  description:
    "A live WebGL sun print: procedurally drawn ferns, grasses, seed heads, veined leaves and flowers lie on brushed watercolor paper while the coating develops from pale chemistry to deep Prussian blue, leaving the plants as white silhouettes with soft lifted edges. The cursor casts shade that holds back the blue and leaves a fading ghost, and every few seconds a wash of water rinses the print and a new arrangement develops. Colors, specimen count, seed, exposure time, wash interval, brushed edge, grain and shade are all props. Fades up softly out of the bare paper on load, adapts its resolution, pauses offscreen, shows a finished print for reduced motion and falls back to a CSS gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { Cyanotype } from "@/components/beste/component/cyanotype";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <Cyanotype className="absolute inset-0" />
  <div className="relative text-white">...</div>
</section>

<Cyanotype
  className="min-h-[32rem]"
  blueColor="#1c3f6e"      // any CSS color
  specimens={7}            // plants per print, 1 to 9
  seed={42}                // same seed, same arrangement
  focus="center"           // "right" (default) | "center" | "full"
  exposureTime={4}         // seconds to develop
  washInterval={0}         // never rinse and redevelop
  shade={0.8}              // how strongly the cursor holds back the blue
/>`,
};
