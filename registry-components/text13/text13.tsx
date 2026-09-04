"use client";

import { motion, useInView, useMotionValue, useReducedMotion, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote";

interface Text13Props {
  /** The text; a soft edge of fog clears across it from left to right */
  text: string;
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  duration?: number;
  /** Width of the soft edge, in percent of the element (default 35) */
  softness?: number;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text13Demo: Text13Props = {
  text: "The fog lifts a little later each morning.",
  as: "p",
  className: "max-w-xs px-6 text-center font-serif text-2xl font-normal leading-[1.15] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text13({ text, as: Tag = "p", trigger = "view", delay = 0.2, duration = 2.2, softness = 35, className }: Text13Props) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const edge = useMotionValue(reduce ? 100 + softness : -softness);
  const maskImage = useTransform(edge, (value) => `linear-gradient(90deg, black ${value - softness}%, transparent ${value}%)`);
  const started = trigger === "mount" || inView;

  useEffect(() => {
    if (!started || reduce) return;
    const controls = animate(edge, 100 + softness, { duration, ease, delay });
    return () => controls.stop();
  }, [started, reduce, edge, softness, duration, delay]);

  const MotionTag = motion[Tag] as typeof motion.p;

  return (
    <MotionTag
      ref={ref as never}
      style={{ maskImage, WebkitMaskImage: maskImage }}
      className={cn("text-balance", className)}
    >
      {text}
    </MotionTag>
  );
}
