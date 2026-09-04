"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote" | "span";

interface Text1Props {
  /** The text; it is split on spaces and each word settles in on its own */
  text: string;
  /** Element to render */
  as?: Tag;
  /** "view" (default) plays when scrolled into view; "mount" plays immediately, for heroes */
  trigger?: "view" | "mount";
  /** Seconds before the first word starts */
  delay?: number;
  /** Seconds between one word and the next */
  stagger?: number;
  /** Seconds each word takes to settle */
  duration?: number;
  /** Additional classes merged onto the element (size, family, colour) */
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text1Demo: Text1Props = {
  text: "Room to breathe, and a way forward.",
  as: "h2",
  className: "max-w-xs px-6 text-center font-serif text-2xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text1({ text, as: Tag = "p", trigger = "view", delay = 0.15, stagger = 0.05, duration = 1.1, className }: Text1Props) {
  const reduce = useReducedMotion() ?? false;
  const hidden = reduce ? {} : { opacity: 0, y: 14, filter: "blur(10px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const inView = trigger === "view";

  return (
    <Tag className={cn("text-balance", className)}>
      {text.split(" ").map((word, index) => (
        <motion.span
          key={index}
          initial={hidden}
          animate={inView ? undefined : shown}
          whileInView={inView ? shown : undefined}
          viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
          transition={{ duration, ease, delay: delay + index * stagger }}
          className="mr-[0.22em] inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
