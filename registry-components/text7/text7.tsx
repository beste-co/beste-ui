"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "p" | "span" | "dd" | "strong";

interface Text7Props {
  /** The number to count up to */
  value: number;
  /** Printed before the number, e.g. "$" */
  prefix?: string;
  /** Printed after the number, e.g. "%" or "+" */
  suffix?: string;
  /** Decimal places to show */
  decimals?: number;
  /** Seconds the count takes */
  duration?: number;
  /** Seconds before the count starts */
  delay?: number;
  /** Group thousands with separators */
  grouping?: boolean;
  as?: Tag;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const text7Demo: Text7Props = {
  value: 2400,
  suffix: "+",
  as: "p",
  className: "font-serif text-5xl leading-none tracking-tight text-foreground md:text-6xl",
};

export function Text7({ value, prefix, suffix, decimals = 0, duration = 2.2, delay = 0, grouping = true, as: Tag = "span", className }: Text7Props) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [current, setCurrent] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration, delay, ease, onUpdate: (latest) => setCurrent(latest) });
    return () => controls.stop();
  }, [inView, reduce, value, duration, delay]);

  const formatted = current.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  });

  return (
    <Tag ref={ref as never} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </Tag>
  );
}
