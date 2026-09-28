import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "slice-assembly",
  title: "Slice Assembly",
  description:
    "A photograph cut into vertical strips that float apart in 3D space, each turned toward or away from the light with its own soft shadow, then settle one after another into the whole picture with no seams left behind. Progress can come from a number or a live scroll value, or the strips loop on their own. Strip count, depth, scatter, stagger, shading, shadow, pace and a gentle cursor lean are all props. Reduced motion shows the whole photograph.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { SliceAssembly } from "@/components/beste/component/slice-assembly";

<SliceAssembly
  className="aspect-[4/5] w-full max-w-md"
  imageSrc="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1400&q=80"
  imageAlt="A woman in a dark check coat walking down a city street"
/>

// Driven by scroll: pass a framer-motion MotionValue (or any { get() }) as progress
const { scrollYProgress } = useScroll({ target: ref });
<SliceAssembly progress={scrollYProgress} strips={18} depth={0.8} stagger={0.4} />`,
};
