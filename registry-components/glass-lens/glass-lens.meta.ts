import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "glass-lens",
  title: "Liquid Glass Type",
  description:
    "Large type set in its own font and rendered live in WebGL under drops of clear liquid glass. The drops drift slowly, melt into each other and split, and one follows the cursor on a spring. Under the glass the type is magnified and bent toward the edges with a faint color split, a soft inner shadow, a thin bright rim and a specular highlight. The real text stays in the page for screen readers. Colors, drop count and size, merge smoothness, refraction, magnification, dispersion, rim, highlight and drift speed are props.",
  category: "Text",
  isAnimated: true,
  cardScale: 0.5,
  fullBleed: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { GlassLens } from "@/components/beste/component/glass-lens";

// The type comes from className: size, weight, family and tracking
<GlassLens
  as="h1"
  text="See through everything."
  className="min-h-[28rem] text-[12vw] font-semibold tracking-[-0.05em]"
/>

<GlassLens
  text="Blown, not poured."
  className="min-h-[24rem] font-serif text-8xl"
  inkColor="var(--foreground)"   // any CSS color, tokens included
  tintColor="var(--primary)"
  blobs={4}                      // 1 to 4 drops
  magnify={0.8}                  // enlarge the type under the glass
  dispersion={0.7}               // color split at the edges
  interactive={false}            // no drop follows the cursor
/>`,
};
