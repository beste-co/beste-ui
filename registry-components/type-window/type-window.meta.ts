import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "type-window",
  title: "Type Window",
  description:
    "A giant word cut out of a solid surface, used as a window onto a full-bleed photo. As progress runs from 0 to 1 the camera flies straight into one letter, the middle one by default: the whole word stays intact and simply grows around a point inside that letter's stroke, on an exponential curve, so the zoom reads as a steady flight with nothing sliding. The letter opens around the camera until the photo fills the frame. The photo moves toward the camera more slowly, for a sense of depth, and drifts gently with the pointer. The word is drawn as glyph outlines on a canvas at device resolution each frame, so it stays put and crisp at every scale. Follows any progress you give it (a pinned section's scroll, a slider) or loops on its own with autoplay. Reduced motion shows a still frame.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: [],
  usage: `import { TypeWindow } from "@/components/beste/component/type-window";

<TypeWindow
  word="Horizon"
  imageSrc="/photos/valley.jpg"
  imageAlt="A mountain valley at first light"
  className="h-[40rem]"
/>

// Drive it with a pinned section's scroll
const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

<TypeWindow
  word="North"
  imageSrc="/photos/fjord.jpg"
  progress={scrollYProgress}  // a MotionValue or a number, 0 to 1
  letter={1}                  // fly into the "o" instead of the middle letter
  surface="foreground"        // cut the word from the dark surface
  fontWeight={900}
  className="absolute inset-0"
/>`,
};
