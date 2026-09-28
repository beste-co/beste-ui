import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "zoom-parallax",
  title: "Zoom Parallax",
  description:
    "Seven photographs in an asymmetric editorial collage around a center image. As progress runs, every photograph grows from its own place at its own pace, the center fastest, so the center photograph glides to fill the frame while the others fly outward past the edges with real depth. Frames carry soft shadows and the photographs stay crisp all the way in. Progress can come from a number or a live scroll value, or the zoom loops on its own. Layout, depth, shadow, pace and a gentle cursor drift are all props. Reduced motion shows the full center photograph.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { ZoomParallax } from "@/components/beste/component/zoom-parallax";

<ZoomParallax className="h-[36rem] w-full" />

// Driven by scroll: pass a framer-motion MotionValue (or any { get() }) as progress
const { scrollYProgress } = useScroll({ target: ref });
<ZoomParallax progress={scrollYProgress} autoplay={false} layout="headline" depth={0.8} />`,
};
