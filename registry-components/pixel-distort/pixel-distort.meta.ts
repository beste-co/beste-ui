import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "pixel-distort",
  title: "Pixel Distort",
  description:
    "A photo laid on an invisible grid of square cells, live in WebGL. Sweeping the cursor drags the cells it passes over in the direction of the movement, like smearing wet paint: a faster sweep pulls further, and the displaced cells break into coarser pixels with a slight red and blue split at their edges. Each cell then eases back into place and the photo sharpens again; a still cursor leaves it alone. On arrival the photo grows softly out of the dark ground and resolves from big pixel blocks into the sharp image. Grid size, strength, radius, how quickly cells settle, color split, pixelation and grain are all props. Draws only while something moves, pauses offscreen, shows the sharp photo for reduced motion and falls back to the plain photo without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { PixelDistort } from "@/components/beste/component/pixel-distort";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <PixelDistort
    className="absolute inset-0"
    src="https://images.unsplash.com/photo-1697128951362-e704be45d3da?w=2000&q=80"
    alt="Raised hands against blue stage light"
  />
  <div className="relative">...</div>
</section>

<PixelDistort
  className="min-h-[32rem]"
  src="https://images.unsplash.com/photo-1697128951362-e704be45d3da?w=2000&q=80"
  grid={20}        // chunkier cells
  strength={0.9}   // a sweep drags further
  relax={0.2}      // cells take longer to settle
/>`,
};
