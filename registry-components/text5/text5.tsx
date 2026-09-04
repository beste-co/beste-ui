"use client";

import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Tag = "h2" | "h3" | "p" | "blockquote";

interface Text5Props {
  /** A longer passage; words brighten in reading order as the passage scrolls through the viewport */
  text: string;
  as?: Tag;
  /** Opacity of a word before the reader reaches it */
  dim?: number;
  className?: string;
}

export const text5Demo: Text5Props = {
  text: "Progress rarely feels like progress while it is happening. Sometimes it is showing up.",
  as: "p",
  className: "max-w-xs px-6 text-center font-serif text-xl font-normal leading-[1.2] tracking-[-0.01em] text-foreground md:text-2xl",
};

function Word({ word, progress, start, end, dim }: { word: string; progress: MotionValue<number>; start: number; end: number; dim: number }) {
  const opacity = useTransform(progress, [start, end], [dim, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.22em] inline-block">
      {word}
    </motion.span>
  );
}

export function Text5({ text, as: Tag = "p", dim = 0.2, className }: Text5Props) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={cn("text-balance", className)}>
      {reduce
        ? text
        : words.map((word, index) => (
            <Word key={index} word={word} progress={scrollYProgress} start={index / words.length} end={(index + 1) / words.length} dim={dim} />
          ))}
    </Tag>
  );
}
