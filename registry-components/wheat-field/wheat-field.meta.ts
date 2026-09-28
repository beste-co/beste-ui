import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "wheat-field",
  title: "Wheat Field",
  description:
    "A field of ripe wheat at golden hour on Canvas 2D: thousands of stalks planted in perspective rows run from dark, backlit stems in the foreground to pale haze at the horizon under a low sun. Gusts roll across the field as traveling bands and every stalk bends on a springy lag; the cursor brushes through the field like a hand, parting the stalks, and a quick sweep sends a ripple running out. Sky, sun, grain, density, wind, gust speed, sway and brush are all props. The stalks grow in softly on load, the stalk count adapts to the device, it pauses offscreen and holds a still field for reduced motion.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { WheatField } from "@/components/beste/component/wheat-field";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <WheatField className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<WheatField
  className="min-h-[32rem]"
  skyTop="#3b4a6b"        // any CSS color
  skyHorizon="#f7c98b"
  sunColor="#ffb86b"
  grainColor="#c98f2e"
  wind={0.8}              // stronger gusts, 0 to 1
  gustSpeed={1.4}         // gusts travel faster
  brush={0.9}             // the cursor parts the stalks further
/>`,
};
