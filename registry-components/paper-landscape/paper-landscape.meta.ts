import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "paper-landscape",
  title: "Paper Landscape",
  description:
    "A layered paper-cut landscape: six hills with clumps of cypress, pine and round paper trees, soft mist between the layers, a low sun that sets behind the far hills on scroll, drifting clouds and a small flock of birds that flap, glide and bob. Layers spread in depth with pointer and scroll parallax. Palette, paper, sun, clouds, birds, mist, tree density and parallax depth are all props, and reduced motion keeps the scene still.",
  category: "Background",
  isAnimated: true,
  demoContentTone: "plain",
  dependencies: ["framer-motion"],
  usage: `import { PaperLandscape } from "@/components/beste/component/paper-landscape";

// As a layer behind content
<section className="relative min-h-[40rem]">
  <PaperLandscape className="absolute inset-0" />
  <div className="relative">...</div>
</section>

<PaperLandscape
  className="min-h-[32rem]"
  palette={["#dfe7ea", "#c3d3d8", "#9db6bf", "#6f919e", "#48707f", "#284b58"]} // far to near
  paperColor="#eef3f4"
  sunColor="#f2c14e"
  birds={3}        // 0 to 5
  trees={0.8}      // denser woods
  parallax={0.7}   // deeper pointer and scroll parallax
/>`,
};
