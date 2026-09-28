import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "letterpress",
  title: "Letterpress",
  description:
    "Type pressed into thick cotton paper, one word at a time: each impression bites in with a slight overshoot, the walls of the letters catch a raking light on one side and fall into shadow on the other, and the ink lies unevenly at the bottom, squeezed at the edges with light spots where it didn't take. When the composition is set it rests, then the sheet slides away and a fresh one is set in the next ink and arrangement. The light follows the cursor so the deboss glints. Built in WebGL from the type's own font, with lines, colors, depth, ink, grain and timing as props; it pauses offscreen, sets the finished sheet for reduced motion and falls back to embossed type without WebGL.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  fullBleed: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { Letterpress } from "@/components/beste/component/letterpress";

// The font, weight and size (as an upper bound) come from className.
// Keep the real heading in the DOM for screen readers, e.g. an sr-only h1.
<Letterpress
  className="min-h-[32rem] font-serif text-8xl font-bold"
  lines={["Pressed", "by hand,", "one word", "at a time."]}
  paperColor="#f1ece1"                          // any CSS color, tokens included
  inkColors={["#1f2a44", "#a8352a", "#2d2a26"]} // one per sheet, cycling
  arrangements={["left", "center", "stagger"]}  // one per sheet, cycling
  interval={0.9}      // seconds between presses, slower than the default
  hold={4}            // seconds a finished sheet rests
  depth={0.7}         // how deep the type bites, 0 to 1
  irregularity={0.6}  // uneven ink, 0 to 1
  area={{ top: 0.2, bottom: 0.3 }} // keep the type clear of your own content
/>`,
};
