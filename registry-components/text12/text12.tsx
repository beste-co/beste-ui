"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text12Props {
  /** A short word or wordmark; its letters rise and fall on a slow, continuous wave */
  text: string;
  as?: Tag;
  /** Height of the wave in em (default 0.08) */
  amplitude?: number;
  /** Seconds for one full swell (default 4) */
  period?: number;
  className?: string;
}

export const text12Demo: Text12Props = {
  text: "Altair",
  as: "h2",
  className: "px-6 font-serif text-5xl font-normal leading-none tracking-[-0.03em] text-foreground md:text-6xl",
};

export function Text12({ text, as: Tag = "span", amplitude = 0.08, period = 4, className }: Text12Props) {
  const reduce = useReducedMotion() ?? false;
  const letters = Array.from(text);

  return (
    <Tag className={cn("inline-block", className)} aria-label={text}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          animate={reduce ? undefined : { y: [`${amplitude}em`, `${-amplitude}em`, `${amplitude}em`] }}
          transition={{ duration: period, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, delay: -(index / letters.length) * period }}
          className="inline-block whitespace-pre will-change-transform"
        >
          {letter}
        </motion.span>
      ))}
    </Tag>
  );
}
