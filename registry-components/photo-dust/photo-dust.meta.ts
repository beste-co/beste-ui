import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "photo-dust",
  title: "Photo Dust",
  description:
    "A photograph made of a couple of hundred thousand grains of colored dust in WebGL. At the start the grains drift as a fine cloud carried by a slow curl wind; as progress rises they settle into place from the bottom up along a soft noise field, each one lifting a little before it lands, until the picture is whole and the real photo fades in for full detail. The cursor blows the settled grains aside as it passes. Progress takes a number or a live scroll source without re-rendering, or autoplay gathers and scatters on a loop. Density, wind, grain, ground color and crop focus are props. It pauses offscreen, adapts its resolution, and shows the plain photo for reduced motion.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { PhotoDust } from "@/components/beste/component/photo-dust";

// Gathers and scatters on its own
<PhotoDust className="aspect-[4/5] w-full max-w-md" />

// Driven by scroll: 0 is loose dust, 1 is the finished photo
<PhotoDust
  className="aspect-[4/5] w-full"
  imageSrc="https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=1600&q=80"
  imageAlt="A glass perfume bottle on warm paper"
  progress={0.6}   // or a scroll MotionValue, read every frame without re-rendering
  autoplay={false}
  density={0.7}
  wind={0.4}
/>`,
};
