import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "scroll-rail",
  title: "Scroll Rail",
  description:
    "A horizontal rail that carries any content sideways: chapters, a timeline, case studies or cards. Travel comes from a number or a live scroll value, or the rail drifts slowly on its own. Inside a panel, data-rail-depth makes an element drift against the travel for depth and data-rail-focus dims it until its panel reaches the middle. One animation loop writes transforms on whole pixels and pauses offscreen. Reduced motion turns the rail into a plain horizontal scroll.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { ScrollRail } from "@/components/beste/component/scroll-rail";

<ScrollRail className="h-[32rem]" gap={48}>
  <div className="w-[26rem]">
    <span data-rail-depth="0.3" className="text-7xl">01</span>
    <h3 data-rail-focus="0.4">Listen first</h3>
  </div>
  <div className="w-[26rem]">
    <span data-rail-depth="0.3" className="text-7xl">02</span>
    <h3 data-rail-focus="0.4">Draw by hand</h3>
  </div>
</ScrollRail>

// Driven by scroll: pass a framer-motion MotionValue (or any { get() }) as progress
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
<ScrollRail progress={scrollYProgress} autoplay={false}>{panels}</ScrollRail>`,
};
