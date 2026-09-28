import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "water-reflection",
  title: "Water Reflection",
  description:
    "A live WebGL surface that sets any landscape photo above a still lake and mirrors it in the water: a rolling swell drawn in perspective, glints on the crests, drops that land on their own and ripple rings that follow the cursor. Waterline, crop, water color, reflectivity, swell, speed, glints, rain and ripples are all props. Grows softly out of the water color on load, adapts its resolution to the device, pauses offscreen, holds a calm frame for reduced motion and falls back to the plain photo without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { WaterReflection } from "@/components/beste/component/water-reflection";

// As a panel or a layer behind content
<WaterReflection
  className="aspect-[16/8] rounded-md"
  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=80"
  alt="Snowy peaks under the Milky Way"
  horizon={0.42}        // waterline height, 0 to 1 from the bottom
  crop={0.12}           // trims the photo's foreground above the waterline
  waterColor="#070b14"  // any CSS color, tokens included
  waves={0.6}           // swell strength, 0 to 1
  rain={0.4}            // drops landing on their own, 0 to 1
/>`,
};
