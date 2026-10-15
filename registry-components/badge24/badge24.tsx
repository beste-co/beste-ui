"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tag = "p" | "span" | "div";
type Trigger = "view" | "mount" | "none";

interface Badge24Props {
  /** The eyebrow text, in sentence case */
  text: string;
  /** Element to render */
  as?: Tag;
  /** Play when scrolled into view (default), at once for heroes, or not at all */
  trigger?: Trigger;
  /** Seconds before the rule starts drawing */
  delay?: number;
  /** Additional classes merged onto the element (set the text color here for dark or photographic surfaces) */
  className?: string;
}

export const badge24Demo: Badge24Props = {
  text: "Alder Row, Riverside",
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const tags = { p: motion.p, span: motion.span, div: motion.div };

export function Badge24({ text, as = "p", trigger = "view", delay = 0, className }: Badge24Props) {
  const reduce = useReducedMotion() ?? false;
  const Tag = tags[as];
  const still = reduce || trigger === "none";
  const play = trigger === "mount" ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, margin: "-10% 0px" as const } };

  return (
    <Tag initial={still ? "shown" : "hidden"} {...play} className={cn("flex items-center gap-3 text-base text-muted-foreground", className)}>
      <motion.span
        aria-hidden="true"
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: 0.9, ease, delay }}
        className="h-px w-8 origin-left bg-current"
      />
      <motion.span variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } }} transition={{ duration: 0.9, ease, delay: delay + 0.15 }}>
        {text}
      </motion.span>
    </Tag>
  );
}
