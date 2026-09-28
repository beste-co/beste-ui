import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "gallery-rail",
  title: "Gallery Rail",
  description:
    "A horizontal gallery wall of photographs in frames of different proportions, hung on one eye line with a title and credit under each. Travel along the wall comes from a number or a live scroll value, or the wall drifts slowly on its own. Each photograph moves a little slower than its frame, and frames grow slightly as they reach the middle. Content such as a heading can hang first on the wall. Photographs load just before they arrive. Reduced motion turns the wall into a plain horizontal scroll.",
  category: "Media",
  isAnimated: true,
  dependencies: [],
  usage: `import { GalleryRail } from "@/components/beste/component/gallery-rail";

<GalleryRail
  className="h-[36rem]"
  items={[
    { src: "https://images.unsplash.com/photo-1579437469180-e31a7aa7273d?w=1400&q=80", alt: "A pebble beach", title: "The long bay", caption: "Nina Simone, 2022", aspect: 1.5 },
    { src: "https://images.unsplash.com/photo-1689202893906-7528e0e89379?w=1400&q=80", alt: "A rocky bay", title: "Under the pines", caption: "Miles Davis, 2024", aspect: 0.75 },
  ]}
/>

// Driven by scroll: pass a framer-motion MotionValue (or any { get() }) as progress
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
<GalleryRail progress={scrollYProgress} autoplay={false} lead={<h2>Room 4</h2>} />`,
};
