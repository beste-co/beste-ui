import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "expanding-frame",
  title: "Expanding Frame",
  description:
    "A two-line headline parts to the left and right while a small rounded photograph between the lines grows to fill the stage, its corners easing square and the picture settling from a close zoom to its full view. Progress can come from a number or a live scroll value, or the frame opens and closes on its own. An overlay passed as children settles in once the photograph is full. Lines, photograph, starting width, corner radius, zoom and pace are all props. Reduced motion shows the full photograph.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { ExpandingFrame } from "@/components/beste/component/expanding-frame";

<ExpandingFrame
  className="h-[36rem] bg-background text-foreground"
  lines={["Built around", "the light."]}
  imageSrc="https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=2000&q=80"
  imageAlt="Curved white bands of a building around an opening of blue sky"
/>

// Driven by scroll: pass a framer-motion MotionValue (or any { get() }) as progress
const { scrollYProgress } = useScroll({ target: ref });
<ExpandingFrame progress={scrollYProgress} autoplay={false} startWidth={0.24} radius={32} />`,
};
