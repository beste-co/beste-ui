"use client";

import { motion, useReducedMotion } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote" | "div";

interface Text2Props {
  /** One entry per line; each line rises out of its own clipped row */
  lines: string[];
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text2Demo: Text2Props = {
  lines: ["Nothing changes", "all at once."],
  as: "h2",
  className: "px-6 text-center font-serif text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text2({ lines, as: Tag = "p", trigger = "view", delay = 0.1, stagger = 0.14, duration = 1.2, className }: Text2Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";

  return (
    <Tag className={className}>
      {/* The parent carries the in-view trigger: a line translated out of its clipped row
          would never intersect the viewport on its own, so it could never reveal itself */}
      <motion.span
        initial="hidden"
        animate={inView ? undefined : "shown"}
        whileInView={inView ? "shown" : undefined}
        viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
        className="block"
      >
        {lines.map((line, index) => (
          <span key={index} className="block overflow-hidden py-[0.06em]">
            <motion.span
              variants={{
                hidden: reduce ? {} : { y: "105%", opacity: 0 },
                shown: { y: "0%", opacity: 1, transition: { duration, ease, delay: delay + index * stagger } },
              }}
              className="block will-change-transform"
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
