import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "ink-fluid",
  title: "Ink Fluid",
  description:
    "A real-time stable fluids simulation in WebGL: pigments swirl through water with vorticity and pressure solving on a small grid, glowing like light on a dark ground and mixing like ink on a light one. The cursor drags ink through the field, clicks switch pigment and drops land on their own when nobody is drawing. Ground color, pigments, grid sizes, solver passes, vorticity, fade, splash size, force and drop interval are all props. The display resolution adapts to the device, it pauses offscreen, settles into a still for reduced motion and falls back to a soft gradient without half-float support.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { InkFluid } from "@/components/beste/component/ink-fluid";

// As a layer behind content
<section className="relative min-h-[40rem] bg-foreground text-background">
  <InkFluid className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<InkFluid
  className="min-h-[32rem]"
  groundColor="#f4efe6"                        // any CSS color; light grounds mix like ink
  pigments={["#1a264c", "#d32f1a", "#b08a2e"]} // colors as they read on white paper
  pigment3="#b08a2e"                          // or set pigments one by one: pigment1, pigment2, pigment3
  vorticity={0.8}                              // tighter eddies, 0 to 1
  fade={0.15}                                  // ink lingers longer, 0 to 1
  autoInterval={0}                             // no drops on their own
/>`,
};
