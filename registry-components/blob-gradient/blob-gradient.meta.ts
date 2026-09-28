import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "blob-gradient",
  title: "Blob Gradient",
  description:
    "A live WebGL lava lamp: soft colored blobs float, merge and pull apart like liquid over a background color, each carrying its own color and blending with its neighbors in Oklab where they meet, so the mix stays bright instead of going muddy. A goo setting runs from soft glowing orbs to crisp liquid edges, a glow adds a halo and light along the edges, and a rise setting moves from free floating to blobs that climb and sink like wax in a lamp. Colors, background, blob count, size, speed, saturation, grain amount and size and the seed are all props; a new palette fades through over a set time, a new count grows blobs in or shrinks them away, and the cursor becomes one more blob that merges with the rest. It grows softly out of its background on load, adapts its resolution to the device, pauses offscreen, holds a still frame for reduced motion and falls back to soft CSS color pools without WebGL.",
  category: "Background",
  isAnimated: true,
  dependencies: [],
  usage: `import { BlobGradient } from "@/components/beste/component/blob-gradient";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <BlobGradient className="absolute inset-0" />
  <div className="relative">...</div>
</section>

// Soft pastel orbs floating freely on the page background
<BlobGradient
  className="min-h-[32rem]"
  colors={["#ffc8dd", "#bde0fe", "#cdb4db"]}
  backgroundColor="var(--background)"
  count={5}
  goo={0.1}                // soft glowing orbs instead of liquid edges
  rise={0}                 // float freely, no lamp drift
  size={1.4}
/>`,
};
