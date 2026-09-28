"use client";

import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "dark" | "light" | "outline";
type Size = "sm" | "md" | "lg";
type Separator = "diamond" | "dot" | "slash" | "none";

interface Marquee1Props {
  /** Words or short phrases carried by the band */
  items: string[];
  /** Base drift speed, 1 is the default pace */
  speed?: number;
  /** How much scrolling speeds the band up, 0 to 1 */
  boost?: number;
  /** Turn with the scroll: the band runs the way the page is scrolling */
  followScroll?: boolean;
  /** Start running to the right instead of the left */
  reverse?: boolean;
  /** Pause while the pointer is over the band */
  pauseOnHover?: boolean;
  /** Accent band (default), dark band, light band or a hairline band on the page color */
  tone?: Tone;
  /** Type size */
  size?: Size;
  /** Mark between items */
  separator?: Separator;
  className?: string;
}

export const marquee1Demo: Marquee1Props = {
  items: ["Posters", "Talks", "Workshops", "Night print", "Type walks", "Open press"],
};

const toneStyles: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  dark: "bg-foreground text-background",
  light: "bg-background text-foreground",
  outline: "border-y border-current/15 bg-transparent text-current",
};

const sizeStyles: Record<Size, { band: string; item: string; mark: string }> = {
  sm: { band: "py-3", item: "gap-6 pr-6 text-xl", mark: "size-2" },
  md: { band: "py-5 md:py-7", item: "gap-8 pr-8 text-3xl md:gap-12 md:pr-12 md:text-5xl", mark: "size-3 md:size-4" },
  lg: { band: "py-7 md:py-10", item: "gap-10 pr-10 text-5xl md:gap-16 md:pr-16 md:text-7xl", mark: "size-4 md:size-5" },
};

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function Mark({ kind, className }: { kind: Separator; className: string }) {
  if (kind === "none") return null;
  if (kind === "slash") return <span aria-hidden="true" className="opacity-50">/</span>;
  return <span aria-hidden="true" className={cn("bg-current", kind === "diamond" ? "rotate-45" : "rounded-full", className)} />;
}

export function Marquee1({
  items,
  speed = 1,
  boost = 0.5,
  followScroll = true,
  reverse = false,
  pauseOnHover = false,
  tone = "primary",
  size = "md",
  separator = "diamond",
  className,
}: Marquee1Props) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const hovered = useRef(false);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const kick = useTransform(velocity, [-1200, 0, 1200], [-1, 0, 1], { clamp: false });
  const direction = useRef(reverse ? -1 : 1);
  const x = useTransform(baseX, (value) => `${wrap(-50, 0, value)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || (pauseOnHover && hovered.current)) return;
    const extra = kick.get() * Math.max(0, Math.min(1, boost)) * 10;
    if (followScroll) {
      if (extra < 0) direction.current = reverse ? 1 : -1;
      else if (extra > 0) direction.current = reverse ? -1 : 1;
    }
    baseX.set(baseX.get() - direction.current * (1.4 * speed + Math.abs(extra)) * (delta / 1000));
  });

  const styles = sizeStyles[size];
  const track = [...items, ...items];

  return (
    <div
      ref={ref}
      onPointerEnter={() => {
        hovered.current = true;
      }}
      onPointerLeave={() => {
        hovered.current = false;
      }}
      className={cn("w-full overflow-hidden", toneStyles[tone], styles.band, className)}
    >
      <span className="sr-only">{items.join(", ")}</span>
      <motion.div aria-hidden="true" style={{ x }} className="flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {track.map((item, index) => (
              <span key={index} className={cn("flex items-center font-semibold tracking-[-0.03em]", styles.item)}>
                {item}
                <Mark kind={separator} className={styles.mark} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
