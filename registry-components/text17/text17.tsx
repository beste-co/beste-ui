"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Text17Props {
  /** The number to show; change it and the digits roll to the new value */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Group thousands with separators */
  grouping?: boolean;
  /** Seconds a digit takes to roll */
  duration?: number;
  /** Advance by one every `tick` seconds, for live counters and clocks. Leave unset for a controlled value. */
  tick?: number;
  className?: string;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DIGITS = Array.from({ length: 10 }, (_, digit) => digit);

export const text17Demo: Text17Props = {
  value: 1240,
  suffix: "+",
  tick: 1,
  className: "font-serif text-5xl leading-none tracking-tight text-foreground md:text-6xl",
};

function Digit({ digit, duration, reduce, index }: { digit: number; duration: number; reduce: boolean; index: number }) {
  return (
    <span className="inline-block h-[1em] overflow-hidden align-baseline">
      <motion.span
        initial={false}
        animate={{ y: `${-digit}em` }}
        transition={reduce ? { duration: 0 } : { duration, ease, delay: index * 0.05 }}
        className="flex flex-col will-change-transform"
      >
        {DIGITS.map((option) => (
          <span key={option} className="block h-[1em] leading-none">
            {option}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function Text17({ value, prefix, suffix, grouping = true, duration = 1.2, tick, className }: Text17Props) {
  const reduce = useReducedMotion() ?? false;
  const [current, setCurrent] = useState(value);

  // Controlled by default: `current` follows `value` unless `tick` is driving it
  useEffect(() => setCurrent(value), [value]);

  useEffect(() => {
    if (!tick || reduce) return;
    const timer = window.setInterval(() => setCurrent((previous) => previous + 1), tick * 1000);
    return () => window.clearInterval(timer);
  }, [tick, reduce]);

  const formatted = Math.round(current).toLocaleString("en-US", { useGrouping: grouping });
  let digitIndex = 0;

  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)} aria-label={`${prefix ?? ""}${formatted}${suffix ?? ""}`}>
      {prefix && <span>{prefix}</span>}
      <span aria-hidden="true" className="inline-flex leading-none">
        {Array.from(formatted).map((character, index) =>
          /\d/.test(character) ? (
            <Digit key={index} digit={Number(character)} duration={duration} reduce={reduce} index={digitIndex++} />
          ) : (
            <span key={index} className="inline-block h-[1em] leading-none">{character}</span>
          )
        )}
      </span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
