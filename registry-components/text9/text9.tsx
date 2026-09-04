"use client";

import { motion, useReducedMotion } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote" | "div";

interface Text9Props {
  /** The text; it arrives as one piece out of a soft blur */
  text: string;
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  duration?: number;
  /** Starting blur in pixels */
  blur?: number;
  /** Starting offset in pixels */
  y?: number;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text9Demo: Text9Props = {
  text: "No forms, no commitment, no need to know what you want yet. Forty minutes to see whether this feels like a place you could talk.",
  as: "p",
  className: "max-w-xs px-6 text-center text-base leading-relaxed text-muted-foreground",
};

export function Text9({ text, as = "p", trigger = "view", delay = 0.1, duration = 1.1, blur = 10, y = 14, className }: Text9Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";
  const hidden = reduce ? {} : { opacity: 0, y, filter: `blur(${blur}px)` };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const Tag = motion[as] as typeof motion.p;

  return (
    <Tag
      initial={hidden}
      animate={inView ? undefined : shown}
      whileInView={inView ? shown : undefined}
      viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
      transition={{ duration, ease, delay }}
      className={className}
    >
      {text}
    </Tag>
  );
}
