"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "current";

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  current: "",
};

interface Shapes83Props {
  stepMs?: number;
  tone?: Tone;
  className?: string;
}

export const shapes83Demo: Shapes83Props = {
  tone: "primary",
};

const SIZES = ["size-7", "size-10", "size-14"];

/* Three squares rise one after another like steps, rest, then start over. */
export function Shapes83({ stepMs = 600, tone = "primary", className }: Shapes83Props) {
  const [shown, setShown] = useState(SIZES.length);

  useEffect(() => {
    const delay = shown === SIZES.length ? stepMs * 5 : stepMs;
    const id = setTimeout(() => setShown(shown >= SIZES.length ? 0 : shown + 1), delay);
    return () => clearTimeout(id);
  }, [shown, stepMs]);

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("flex items-end gap-2.5", toneClasses[tone])} aria-hidden="true">
        {SIZES.map((size, index) => (
          <span
            key={index}
            className={cn(
              "origin-bottom rounded-md bg-current transition-transform duration-500 ease-out motion-reduce:transition-none",
              size,
              index < shown ? "scale-100" : "scale-0"
            )}
          />
        ))}
      </div>
    </div>
  );
}
