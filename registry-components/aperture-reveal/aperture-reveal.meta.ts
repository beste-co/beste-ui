import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "aperture-reveal",
  title: "Aperture Reveal",
  description:
    "A Canvas 2D camera iris in front of a full-bleed photograph: machined blades in brushed dark metal, each catching the light at its own angle, with crisp overlapping seams, soft cast shadows, lit edges and fine grain, set in a turned metal ring on a matte lens body. As it opens the blades turn and retract, then the ring grows past the frame so the photo stands alone. Progress can be driven from scroll (a number or a MotionValue, read every frame without re-renders) or left to a slow open, hold and close loop. The light on the metal and the photo drift with the cursor. Blade count, colors, rotation, twist, pace and grain are props; it pauses offscreen and holds a still frame for reduced motion.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { ApertureReveal } from "@/components/beste/component/aperture-reveal";

<ApertureReveal className="h-[32rem] w-full" />

// Driven by scroll: pass a number from 0 (closed) to 1 (open), or a framer-motion MotionValue
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

<ApertureReveal
  className="absolute inset-0"
  imageSrc="/photos/night-sky.jpg"
  imageAlt="Snowy peaks under the Milky Way"
  progress={scrollYProgress}
  blades={11}                 // 5 to 16
  bladeColor="#23201c"        // any CSS color
  highlightColor="#ffe9c7"
  twist={0.8}                 // blades turn further while opening
/>`,
};
