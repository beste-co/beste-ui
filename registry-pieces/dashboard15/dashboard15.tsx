"use client";

import { cn } from "@/lib/utils";

interface Dashboard15Ring {
  label: string;
  value: number;
  unit?: string;
  tone: "violet" | "emerald" | "amber" | "sky" | "rose";
}

interface Dashboard15Props {
  rings?: Dashboard15Ring[];
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

export const dashboard15Demo: Dashboard15Props = {
  rings: [
    { label: "Move", value: 72, unit: "kcal", tone: "rose" },
    { label: "Exercise", value: 54, unit: "min", tone: "emerald" },
    { label: "Stand", value: 88, unit: "hr", tone: "sky" },
  ],
};

export function Dashboard15({ rings = [], className }: Dashboard15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
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
                <span className="truncate text-card-foreground">{r.label}</span>
              </div>
              <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
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
