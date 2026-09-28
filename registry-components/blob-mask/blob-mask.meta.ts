import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "blob-mask",
  title: "Blob Mask",
  description:
    "A photo clipped by an organic SVG blob that breathes continuously, trailed by an offset outline blob, and swells gently toward the cursor. The path is rebuilt from noise-driven points each frame and written straight to the DOM. Colors, lobe count, wobble, speed, outline and swell are all props; it pauses offscreen and holds one still shape for reduced motion.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { BlobMask } from "@/components/beste/component/blob-mask";

<BlobMask
  className="aspect-square max-w-[560px]"   // give it a size; the blob fills it
  src="https://images.unsplash.com/photo-1617897903246-719242758050?w=1600&q=80"
  alt="A dropper bottle of golden oil"
  outlineColor="#b07a5b"   // any CSS color
  points={7}               // fewer, rounder lobes
  wobble={0.8}             // livelier edge, 0 to 1
  bulge={0.7}              // swell toward the cursor, 0 to 1
  outline={false}          // drop the trailing outline
/>`,
};
