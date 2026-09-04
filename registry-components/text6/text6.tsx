"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface Text6Props {
  /** The text; it is typed out character by character */
  text: string;
  as?: Tag;
  /** "view" (default) starts typing when scrolled into view; "mount" starts at once */
  trigger?: "view" | "mount";
  /** Milliseconds per character */
  speed?: number;
  /** Milliseconds before the first character */
  delay?: number;
  /** Keep the caret blinking after the last character */
  caret?: boolean;
  className?: string;
}

export const text6Demo: Text6Props = {
  text: "Come as you are.",
  as: "h2",
  className: "px-6 text-center font-serif text-2xl font-normal leading-[1.1] tracking-[-0.02em] text-foreground md:text-3xl",
};

export function Text6({ text, as: Tag = "p", trigger = "view", speed = 45, delay = 200, caret = true, className }: Text6Props) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [count, setCount] = useState(reduce ? text.length : 0);
  const started = trigger === "mount" || inView;

  useEffect(() => {
    if (!started || reduce) return;
    let index = 0;
    let timer = 0;
    const tick = () => {
      index += 1;
      setCount(index);
      if (index < text.length) timer = window.setTimeout(tick, speed);
    };
    timer = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer);
  }, [started, reduce, text, speed, delay]);

  const done = count >= text.length;

  return (
    <Tag ref={ref as never} className={cn("inline-block", className)} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {caret && (
        <span
          aria-hidden="true"
          className={cn("ml-[0.08em] inline-block h-[0.9em] w-px translate-y-[0.12em] bg-current", done && "animate-pulse")}
        />
      )}
    </Tag>
  );
}
