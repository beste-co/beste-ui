import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "curtain-reveal",
  title: "Curtain Reveal",
  description:
    "A heavy theatre curtain in WebGL in front of a full-bleed photograph: crimson velvet hanging in deep vertical folds, each face turned to the viewer staying dark and saturated while the faces turned away catch a soft rim of light, with fine vertical pile, a weighted hem and gathered swags across the top. As it opens each half draws to its side, the folds bunching tighter and deeper, the hem trailing the top and lifting off the floor, a soft shadow falling on the stage while the house lights come up on the photo. The fabric breathes slowly and sways where the cursor brushes past. Progress can be driven from scroll (a number or a MotionValue, read every frame without re-renders) or left to a slow open, hold and close loop. Color, sheen, folds, swags, the width kept at the sides and grain are props; it pauses offscreen and holds the open stage for reduced motion.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: [],
  usage: `import { CurtainReveal } from "@/components/beste/component/curtain-reveal";

<CurtainReveal className="h-[32rem] w-full" />

// Driven by scroll: pass a number from 0 (closed) to 1 (open), or a framer-motion MotionValue
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

<CurtainReveal
  className="absolute inset-0"
  imageSrc="/photos/stage.jpg"
  imageAlt="The orchestra on stage"
  progress={scrollYProgress}
  autoplay={false}
  color="#1d2a4a"          // any CSS color
  sheenColor="#8fa6d8"
  folds={14}
  valance={0}              // no swags across the top
  frame={0}                // draw the curtain fully out of view
/>`,
};
