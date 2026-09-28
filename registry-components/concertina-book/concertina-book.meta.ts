import type { ComponentMeta } from "@/lib/component-types";

export const meta: ComponentMeta = {
  name: "concertina-book",
  title: "Concertina Book",
  description:
    "A folded concertina book whose pages carry one wide photo printed across the whole strip. As it opens, each page unfolds in 3D from a tight zigzag pile on the right, catching light and shade on its folds, until the picture lies flat and unbroken. Folds and unfolds on its own loop with autoplay, opens as it passes through the viewport, or follows any progress you hand it (a pinned section's scroll, a slider). Pages, fold angle, shade and page aspect are props; reduced motion shows the flat pages in a swipeable row.",
  category: "Media",
  isAnimated: true,
  fullBleed: true,
  dependencies: ["framer-motion"],
  usage: `import { ConcertinaBook } from "@/components/beste/component/concertina-book";
import { useScroll } from "framer-motion";

// Opens on its own as it scrolls through the viewport
<ConcertinaBook
  className="h-[32rem]"
  image={{ src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2400&q=80", alt: "A calm lake below pines" }}
  pages={6}          // number of folded pages
  fold={78}          // largest fold angle, in degrees
  shade={0.5}        // light and shade on the folds, 0 to 1
/>

// Driven by a pinned section: scrolling down turns into sideways travel
function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 h-svh">
        <ConcertinaBook className="h-full" image={...} progress={scrollYProgress} />
      </div>
    </section>
  );
}`,
};
