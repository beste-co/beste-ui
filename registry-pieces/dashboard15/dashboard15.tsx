"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard15Ring {
  label: string;
  value: number;
  unit?: string;
  tone: "violet" | "emerald" | "amber" | "sky" | "rose";
}

interface Dashboard15Props {
  rings?: Dashboard15Ring[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const RING_CLASSES: Record<Dashboard15Ring["tone"], string> = {
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  sky: "text-sky-500",
  rose: "text-rose-500",
};

const DOT_CLASSES: Record<Dashboard15Ring["tone"], string> = {
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
};

const RADII = [26, 20, 14];
const STROKE = 4;


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const dashboard15Demo: Dashboard15Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  rings: [
    { label: "Move", value: 72, unit: "kcal", tone: "rose" },
    { label: "Exercise", value: 54, unit: "min", tone: "emerald" },
    { label: "Stand", value: 88, unit: "hr", tone: "sky" },
  ],
};

export function Dashboard15({ rings = [], surface = "card", bordered = true, inverted = false, className }: Dashboard15Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <svg
          className="size-20 shrink-0 -rotate-90"
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          {rings.slice(0, 3).map((r, i) => {
            const radius = RADII[i] ?? 10;
            const circ = 2 * Math.PI * radius;
            const pct = Math.max(0, Math.min(100, r.value));
            return (
              <g key={r.label} className={RING_CLASSES[r.tone]}>
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="none"
                  strokeWidth={STROKE}
                  className="stroke-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  fill="none"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  stroke="currentColor"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - pct / 100)}
                />
              </g>
            );
          })}
        </svg>
        <ul className="flex min-w-0 flex-1 flex-col gap-1">
          {rings.map((r) => (
            <li
              key={r.label}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className={cn("size-2 shrink-0 rounded-full", DOT_CLASSES[r.tone])}
                  aria-hidden="true"
                />
                <span className="truncate">{r.label}</span>
              </div>
              <span className="shrink-0 font-mono tabular-nums text-current/60">
                {r.value}
                {r.unit ? ` ${r.unit}` : "%"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
