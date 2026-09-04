"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text11Props {
  /** The text; each word begins as a soft, spread blot of ink and dries into crisp type */
  text: string;
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text11Demo: Text11Props = {
  text: "Slow, on purpose.",
  as: "h2",
  className: "px-6 text-center font-serif text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text11({ text, as: Tag = "p", trigger = "view", delay = 0.1, stagger = 0.12, duration = 1.6, className }: Text11Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";

  return (
    <Tag className={cn("text-balance", className)}>
      <motion.span
        initial="wet"
        animate={inView ? undefined : "dry"}
        whileInView={inView ? "dry" : undefined}
        viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
        className="inline"
      >
        {text.split(" ").map((word, index) => (
          <motion.span
            key={index}
            variants={{
              wet: reduce ? {} : { opacity: 0, filter: "blur(18px)", letterSpacing: "0.18em", scale: 1.06 },
              dry: { opacity: 1, filter: "blur(0px)", letterSpacing: "0em", scale: 1, transition: { duration, ease, delay: delay + index * stagger } },
            }}
            className="mr-[0.22em] inline-block origin-left will-change-[transform,filter,letter-spacing]"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
