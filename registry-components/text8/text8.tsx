"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Text8Props {
  /** The phrase to underline; render it inline inside a heading or a sentence */
  text: string;
  trigger?: "view" | "mount";
  /** Seconds before the line starts drawing */
  delay?: number;
  /** Seconds the line takes to draw */
  duration?: number;
  /** Gap between the text and the line, in em (default 0.18) */
  offset?: number;
  /** Line thickness in pixels (default 1) */
  thickness?: number;
  /** Line colour, e.g. "bg-primary" (defaults to the text colour) */
  lineClassName?: string;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text8Demo: Text8Props = {
  text: "listened to the end",
  className: "font-serif text-2xl leading-[1.1] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text8({ text, trigger = "view", delay = 0.3, duration = 1.2, offset = 0.18, thickness = 1, lineClassName, className }: Text8Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";

  return (
    // No padding on this span: the line spans exactly the width of the words
    <span className={cn("relative inline-block", className)}>
      {text}
      <motion.span
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView ? undefined : { scaleX: 1 }}
        whileInView={inView ? { scaleX: 1 } : undefined}
        viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
        transition={{ duration, ease, delay }}
        style={{ bottom: `-${offset}em`, height: thickness }}
        className={cn("absolute left-0 right-0 block origin-left bg-current", lineClassName)}
      />
    </span>
  );
}
