"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text3Props {
  /** Short text; every character arrives on its own */
  text: string;
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text3Demo: Text3Props = {
  text: "Therapy and coaching",
  as: "p",
  className: "px-6 text-center text-sm uppercase tracking-[0.25em] text-muted-foreground",
};

export function Text3({ text, as: Tag = "span", trigger = "view", delay = 0.1, stagger = 0.02, duration = 0.8, className }: Text3Props) {
  const reduce = useReducedMotion() ?? false;
  const hidden = reduce ? {} : { opacity: 0, y: 6, filter: "blur(6px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const inView = trigger === "view";

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {Array.from(text).map((character, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          initial={hidden}
          animate={inView ? undefined : shown}
          whileInView={inView ? shown : undefined}
          viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
          transition={{ duration, ease, delay: delay + index * stagger }}
          className="inline-block whitespace-pre will-change-transform"
        >
          {character}
        </motion.span>
      ))}
    </Tag>
  );
}
