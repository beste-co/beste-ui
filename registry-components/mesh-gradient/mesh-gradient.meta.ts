import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "mesh-gradient",
  title: "Mesh Gradient",
  description:
    "A live WebGL mesh gradient: up to six colors drift as soft fields that blend in Oklab, so every mix between two hues stays clean and bright instead of going muddy. A fractal domain warp lets the fields flow into each other, a slow swirl twists the center, and a film grain sits on top, held still or flickering like film. Colors, speed, scale, distortion, swirl, softness, saturation, grain amount and size, posterized bands and the seed are all props; a new palette fades through over a set time, and the cursor draws the field toward itself like a soft lens. It grows softly out of its first color on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to soft CSS color pools without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { MeshGradient } from "@/components/beste/component/mesh-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <MeshGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// A pale, heavily grained pastel with theme tokens
<MeshGradient
  className="min-h-[32rem]"
  colors={["var(--background)", "#ffd6e0", "#c9e4ff", "var(--primary)"]}
  distortion={0.8}
  softness={0.8}
  grain={0.6}
  grainSize={2}
  transition={2}           // a new palette fades in over 2 seconds
/>`,
};
