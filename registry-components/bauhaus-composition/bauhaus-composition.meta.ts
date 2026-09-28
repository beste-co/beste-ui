import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "bauhaus-composition",
  title: "Bauhaus Composition",
  description:
    "A living constructivist poster in crisp SVG: circles, half and quarter circles, squares, a triangle, bars and hairline rules snapped to a modular grid rearrange into a new balanced composition every few seconds. Each form springs to its new place with a slight stagger, quarter circles turning in quarter steps and bars sliding along their axis, one muted form printing over the rest like overlapping inks. Forms lean away from the cursor and a click moves on at once. Palette, form count, seed, rhythm, spring, stagger, repel and grid are all props; the forms grow in one after another on load, it pauses offscreen and holds one arrangement for reduced motion.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "theme",
  dependencies: [],
  usage: `import { BauhausComposition } from "@/components/beste/component/bauhaus-composition";

// As a panel or a layer behind content
<BauhausComposition className="aspect-[4/5]" />

<BauhausComposition
  className="min-h-[32rem]"
  inkColor="var(--foreground)"   // any CSS color, tokens included
  accentColor="#d9412b"          // the loud color, usually the big circle
  secondaryColor="#e3b23c"
  tertiaryColor="#2c5aa0"
  shapes={18}                    // 6 to 24 forms
  seed={3}                       // a different cast and sequence
  interval={6}                   // seconds per arrangement
  bounce={0.8}                   // livelier arrival
  columns={8}                    // a coarser grid
/>`,
};
