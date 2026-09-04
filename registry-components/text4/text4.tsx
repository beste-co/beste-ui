"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text4Props {
  /** Printed before the turning word */
  before?: string;
  /** Words that take turns */
  words: string[];
  /** Printed after the turning word */
  after?: string;
  /** Milliseconds each word stays */
  interval?: number;
  /** "view" (default) settles the fixed words in when scrolled into view; "mount" plays at once */
  trigger?: "view" | "mount";
  as?: Tag;
  className?: string;
  /** Classes for the turning word only, e.g. a muted colour */
  wordClassName?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text4Demo: Text4Props = {
  before: "Room to",
  words: ["breathe.", "think.", "rest.", "begin again."],
  as: "h2",
  className: "px-6 text-center font-serif text-2xl font-normal leading-[1.05] tracking-[-0.02em] text-foreground md:text-3xl",
  wordClassName: "text-muted-foreground",
};

export function Text4({ before, words, after, interval = 2800, trigger = "view", as: Tag = "p", className, wordClassName }: Text4Props) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);
  const hidden = reduce ? {} : { opacity: 0, y: 14, filter: "blur(10px)" };
  const shown = { opacity: 1, y: 0, filter: "blur(0px)" };
  const inView = trigger === "view";
  const beforeWords = before ? before.split(" ") : [];
  const afterWords = after ? after.split(" ") : [];
  const fixed = (word: string, index: number) => (
    <motion.span
      key={index}
      initial={hidden}
      animate={inView ? undefined : shown}
      whileInView={inView ? shown : undefined}
      viewport={inView ? { once: true, margin: "-10% 0px" } : undefined}
      transition={{ duration: 1.1, ease, delay: 0.3 + index * 0.07 }}
      className="mr-[0.22em] inline-block will-change-transform"
    >
      {word}
    </motion.span>
  );

  useEffect(() => {
    if (words.length < 2 || reduce) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % words.length), interval);
    return () => window.clearInterval(timer);
  }, [words.length, interval, reduce]);

  return (
    <Tag className={className}>
      {beforeWords.map(fixed)}
      <span className="relative inline-block align-top">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active}
            initial={reduce ? {} : { opacity: 0, y: 14, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? {} : { opacity: 0, y: -14, filter: "blur(10px)" }}
            transition={{ duration: 0.9, ease }}
            className={cn("inline-block will-change-transform", wordClassName)}
          >
            {words[active]}
          </motion.span>
        </AnimatePresence>
      </span>
      {afterWords.length > 0 && <span className="mr-[0.22em]" />}
      {afterWords.map((word, index) => fixed(word, beforeWords.length + 1 + index))}
    </Tag>
  );
}
