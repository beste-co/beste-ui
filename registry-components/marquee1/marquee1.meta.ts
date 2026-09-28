import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "marquee1",
  title: "Velocity Marquee",
  description:
    "A full-width band of words that drifts on its own, speeds up with scroll velocity and turns to run the way the page is scrolling. Tone, size, separator, speed, boost and direction are props. It stops when offscreen and stands still for reduced motion.",
  category: "Marquee",
  isAnimated: true,
  dependencies: ["framer-motion"],
  usage: `import { Marquee1 } from "@/components/beste/component/marquee1";

<Marquee1 items={["Posters", "Talks", "Workshops", "Night print"]} />

<Marquee1
  items={["Open daily", "Free entry", "Late on Fridays"]}
  tone="dark"          // "primary" (default) | "dark" | "light" | "outline"
  size="sm"            // "sm" | "md" (default) | "lg"
  separator="dot"      // "diamond" (default) | "dot" | "slash" | "none"
  speed={0.6}          // base drift, 1 is the default pace
  boost={0.8}          // how much scrolling speeds it up, 0 to 1
  followScroll={false} // keep one direction whatever the scroll does
  pauseOnHover
/>`,
};
