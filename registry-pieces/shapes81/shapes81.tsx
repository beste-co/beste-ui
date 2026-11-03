"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "current";

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  current: "",
};

interface Shapes81Props {
  durationMs?: number;
  tone?: Tone;
  className?: string;
}

export const shapes81Demo: Shapes81Props = {
  tone: "primary",
};

/* A ring that draws itself closed from the top, rests, fades, and draws again. */
export function Shapes81({ durationMs = 3600, tone = "primary", className }: Shapes81Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <style>{`
@keyframes shapes81-draw { 0% { stroke-dashoffset: 100; opacity: 1; } 55% { stroke-dashoffset: 0; opacity: 1; } 82% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
.shapes81-draw { animation: shapes81-draw var(--shapes81-d) cubic-bezier(0.65, 0, 0.35, 1) infinite; }
@media (prefers-reduced-motion: reduce) { .shapes81-draw { animation: none; stroke-dashoffset: 0; } }
`}</style>
      <svg
        viewBox="0 0 80 80"
        className={cn("size-20 -rotate-90", toneClasses[tone])}
        style={{ "--shapes81-d": `${durationMs}ms` } as CSSProperties}
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-20" />
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          className="shapes81-draw"
        />
      </svg>
    </div>
  );
}
