"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Text16Props {
  /** The phrase to highlight; render it inline inside a heading or a sentence */
  text: string;
  trigger?: "view" | "mount";
  delay?: number;
  duration?: number;
  /** The highlight surface, e.g. "bg-muted" (default) or "bg-primary/20" */
  highlightClassName?: string;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text16Demo: Text16Props = {
  text: "listened to",
  className: "font-serif text-2xl leading-[1.1] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text16({ text, trigger = "view", delay = 0.3, duration = 1, highlightClassName, className }: Text16Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";

  return (
    <span className={cn("relative isolate inline-block px-[0.15em]", className)}>
      {/* isolate makes this span its own stacking context, so the -z-10 surface lands behind the
          words rather than behind whatever background the section around it is painted on */}
      <motion.span
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView ? undefined : { scaleX: 1 }}
        whileInView={inView ? { scaleX: 1 } : undefined}
        viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
        transition={{ duration, ease, delay }}
        className={cn("absolute inset-x-0 bottom-[0.02em] top-[0.08em] -z-10 block origin-left rounded-md bg-muted", highlightClassName)}
      />
      {text}
    </span>
  );
}
