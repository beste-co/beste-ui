import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "marble-slab",
  title: "Marble Slab",
  description:
    "A live WebGL background of polished, book-matched marble: domain-warped veins of varying width that fade in and out along their length, finer hairline veins, a sparse crackle, a warm metallic tint at the vein edges and a cloudy translucent depth around them, mirrored around a hairline joint the way two slabs are opened like a book. The stone is rendered once into a texture; only the polish moves, a large softbox reflection that drifts slowly across the surface, shimmers through a fine micro relief and follows the cursor. Colors, scale, vein count, warp, book matching, gloss and speed are all props. The veins surface softly out of the flat ground on load; it pauses offscreen, holds a still frame for reduced motion and shows a soft stone gradient without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  demoContentTone: "theme",
  usage: `import { MarbleSlab } from "@/components/beste/component/marble-slab";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <MarbleSlab className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A dark Nero Marquina with white veins
<MarbleSlab
  className="min-h-[32rem]"
  groundColor="#16161a"
  veinColor="#e9e6e1"
  accentColor="#8a8f99"
  veins={0.7}
  warp={0.8}
  bookMatch={false}
/>`,
};
