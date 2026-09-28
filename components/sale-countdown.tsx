"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { COUNTDOWN_END } from "@/lib/pricing";
import { cn } from "@/lib/utils";

// One ticker for the whole page, aligned to the wall-clock second, so every
// countdown on screen (the home band, the pricing page) flips on the same frame.
let now = 0;
let timer: number | undefined;
const listeners = new Set<() => void>();

function tick() {
  now = Date.now();
  for (const listener of listeners) listener();
  timer = window.setTimeout(tick, 1000 - (now % 1000));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    now = Date.now();
    timer = window.setTimeout(tick, 1000 - (now % 1000));
  }
  queueMicrotask(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };
}

export interface CountdownPart {
  label: "d" | "h" | "m" | "s";
  value: number;
}

/** Time left until the sale ends, or null before mount and once it has ended. */
export function useCountdown(): { now: number; parts: CountdownPart[] } | null {
  const current = useSyncExternalStore(
    subscribe,
    () => now,
    () => 0
  );
  if (!current) return null;
  const seconds = Math.floor(Math.max(0, COUNTDOWN_END - current) / 1000);
  if (seconds <= 0) return null;
  return {
    now: current,
    parts: [
      { label: "d", value: Math.floor(seconds / 86400) },
      { label: "h", value: Math.floor((seconds % 86400) / 3600) },
      { label: "m", value: Math.floor((seconds % 3600) / 60) },
      { label: "s", value: seconds % 60 },
    ],
  };
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** One digit that rolls down into place when it changes. */
function Digit({ value, reduce }: { value: string; reduce: boolean }) {
  return (
    <span className="relative flex h-[1.25em] w-[0.62em] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduce ? false : { y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduce ? undefined : { y: "100%", opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** The d/h/m/s boxes. Decorative: callers carry the readable sentence. */
export function CountdownDigits({ parts, className }: { parts: CountdownPart[]; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <span aria-hidden="true" className={cn("flex items-center gap-1.5 font-mono tabular-nums", className)}>
      {parts.map((part) => (
        <span key={part.label} className="flex h-6 items-center rounded-md bg-foreground/5 px-1.5 leading-none">
          {String(part.value)
            .padStart(2, "0")
            .split("")
            .map((digit, index) => (
              // Keyed by position so each place rolls on its own.
              <Digit key={`${part.label}-${index}`} value={digit} reduce={reduce} />
            ))}
          <span className="ml-0.5 flex h-[1.25em] items-center text-muted-foreground">{part.label}</span>
        </span>
      ))}
    </span>
  );
}
