"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text10Props {
  /** Short, bold text; the photograph shows through the letters */
  text: string;
  /** The photograph that fills the letters */
  image: { src: string; alt?: string };
  as?: Tag;
  /** How far the photograph drifts inside the letters as the page scrolls, in percent */
  drift?: number;
  className?: string;
}

export const text10Demo: Text10Props = {
  text: "Breathe",
  image: { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop" },
  as: "h2",
  className: "px-6 text-center font-serif text-6xl font-normal leading-none tracking-[-0.03em] md:text-7xl",
};

export function Text10({ text, image, as: Tag = "span", drift = 30, className }: Text10Props) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const backgroundPositionY = useTransform(scrollYProgress, [0, 1], reduce ? ["50%", "50%"] : [`${50 - drift / 2}%`, `${50 + drift / 2}%`]);
  const MotionTag = motion[Tag] as typeof motion.span;

  return (
    <MotionTag
      ref={ref as never}
      style={{ backgroundImage: `url(${image.src})`, backgroundPositionY }}
      className={cn("inline-block bg-cover bg-center bg-clip-text text-transparent", className)}
      aria-label={image.alt ? `${text}, ${image.alt}` : undefined}
    >
      {text}
    </MotionTag>
  );
}
