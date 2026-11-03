"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "current";

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  current: "",
};

interface Shapes82Props {
  durationMs?: number;
  tone?: Tone;
  className?: string;
}

export const shapes82Demo: Shapes82Props = {
  tone: "primary",
};

/* An outlined circle slides over a solid one and back, like work changing hands. */
export function Shapes82({ durationMs = 3200, tone = "primary", className }: Shapes82Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{`
@keyframes shapes82-pass { 0%, 12% { transform: translateX(0); } 48%, 62% { transform: translateX(-2.5rem); } 98%, 100% { transform: translateX(0); } }
.shapes82-pass { animation: shapes82-pass var(--shapes82-d) cubic-bezier(0.65, 0, 0.35, 1) infinite; }
@media (prefers-reduced-motion: reduce) { .shapes82-pass { animation: none; } }
`}</style>
      <div
        className={cn("relative flex h-14 w-28 items-center", toneClasses[tone])}
        style={{ "--shapes82-d": `${durationMs}ms` } as CSSProperties}
        aria-hidden="true"
      >
        <span className="absolute left-0 size-14 rounded-full bg-current" />
        <span className="shapes82-pass absolute right-0 size-14 rounded-full border-[6px] border-current" />
      </div>
    </div>
  );
}
