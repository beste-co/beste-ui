"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text14Props {
  /** Short text; its letters start scattered and drift home one by one */
  text: string;
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  stagger?: number;
  /** How far the letters start from home, in em (default 0.9) */
  spread?: number;
  className?: string;
}

// A fixed, evenly spread scatter so the server and the client draw the same letters
function offset(index: number, spread: number) {
  const angle = index * 2.399;
  const distance = (0.4 + ((index * 7) % 5) / 8) * spread;
  return { x: `${Math.cos(angle) * distance}em`, y: `${Math.sin(angle) * distance}em`, rotate: ((index * 37) % 40) - 20 };
}

export const text14Demo: Text14Props = {
  text: "settle",
  as: "h2",
  className: "px-6 font-serif text-5xl font-normal leading-none tracking-[-0.03em] text-foreground md:text-6xl",
};

export function Text14({ text, as: Tag = "span", trigger = "view", delay = 0.1, stagger = 0.06, spread = 0.9, className }: Text14Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      <motion.span
        initial="scattered"
        animate={inView ? undefined : "home"}
        whileInView={inView ? "home" : undefined}
        viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
        className="inline-block"
      >
        {Array.from(text).map((letter, index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            variants={{
              scattered: reduce ? {} : { ...offset(index, spread), opacity: 0, filter: "blur(4px)" },
              home: { x: "0em", y: "0em", rotate: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 60, damping: 14, mass: 0.9, delay: delay + index * stagger } },
            }}
            className="inline-block whitespace-pre will-change-transform"
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
