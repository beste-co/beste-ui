"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Dashboard21Props {
  label?: string;
  value?: number;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const arcClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const RADIUS = 28;
const CIRC = 2 * Math.PI * RADIUS;

export const dashboard21Demo: Dashboard21Props = {
  label: "Storage used",
  value: 68,
  caption: "34 GB of 50 GB",
  tone: "violet",
};

export function Dashboard21({
  label = "Progress",
  value = 0,
  caption,
  tone = "violet",
  className,
}: Dashboard21Props) {
  const pct = Math.max(0, Math.min(100, value));
  const offset = CIRC * (1 - pct / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className={cn("relative size-16 shrink-0", arcClasses[tone])}>
          <svg
            viewBox="0 0 64 64"
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              className="stroke-muted"
            />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold tabular-nums text-card-foreground">
            {Math.round(pct)}%
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {caption && (
            <span className="truncate font-mono text-sm text-card-foreground">
              {caption}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
