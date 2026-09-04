"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text19Props {
  /** Printed before the corrected word */
  before?: string;
  /** The word that gets struck through */
  struck: string;
  /** The word that takes its place */
  replacement: string;
  /** Printed after the corrected word */
  after?: string;
  as?: Tag;
  trigger?: "view" | "mount";
  delay?: number;
  className?: string;
  /** Classes for the struck word, e.g. a muted colour */
  struckClassName?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text19Demo: Text19Props = {
  before: "Not",
  struck: "fixed.",
  replacement: "heard.",
  as: "h2",
  className: "px-6 text-center font-serif text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-foreground md:text-3xl",
  struckClassName: "text-muted-foreground",
};

export function Text19({ before, struck, replacement, after, as: Tag = "p", trigger = "view", delay = 0.4, className, struckClassName }: Text19Props) {
  const reduce = useReducedMotion() ?? false;
  const inView = trigger === "view";
  const hidden = reduce ? {} : { opacity: 0, y: 10, filter: "blur(8px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <Tag className={className}>
      {before && <span className="mr-[0.22em]">{before}</span>}
      {/* The line is drawn through the old word first; the new one arrives once it is crossed out */}
      <span className={cn("relative mr-[0.22em] inline-block", struckClassName)} aria-hidden="true">
        {struck}
        <motion.span
          initial={reduce ? false : { scaleX: 0 }}
          animate={inView ? undefined : { scaleX: 1 }}
          whileInView={inView ? { scaleX: 1 } : undefined}
          viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
          transition={{ duration: 0.8, ease, delay }}
          className="absolute left-0 right-0 top-[52%] block h-px origin-left bg-current"
        />
      </span>
      <motion.span
        initial={hidden}
        animate={inView ? undefined : shown}
        whileInView={inView ? shown : undefined}
        viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
        transition={{ duration: 1, ease, delay: delay + 0.7 }}
        className="inline-block will-change-transform"
      >
        {replacement}
      </motion.span>
      {after && <span className="ml-[0.22em]">{after}</span>}
    </Tag>
  );
}
