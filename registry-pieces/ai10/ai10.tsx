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

interface Ai10Props {
  label?: string;
  used?: number;
  quota?: number;
  resetsIn?: string;
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

const RADIUS = 18;
const CIRC = 2 * Math.PI * RADIUS;

export const ai10Demo: Ai10Props = {
  label: "Monthly requests",
  used: 4200,
  quota: 10000,
  resetsIn: "resets in 12d",
  tone: "violet",
};

export function Ai10({
  label = "Requests",
  used = 0,
  quota = 1000,
  resetsIn,
  tone = "violet",
  className,
}: Ai10Props) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, quota)) * 100));
  const offset = CIRC * (1 - pct / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
        <div
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center",
            arcClasses[tone]
          )}
        >
          <svg
            className="absolute inset-0 size-11 -rotate-90"
            viewBox="0 0 44 44"
            aria-hidden="true"
          >
            <circle
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              className="stroke-muted"
            />
            <circle
              cx="22"
              cy="22"
              r={RADIUS}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="relative font-mono text-xs font-semibold tabular-nums text-card-foreground">
            {Math.round(pct)}%
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-sm tabular-nums text-card-foreground">
            {used.toLocaleString()}{" "}
            <span className="text-muted-foreground">
              / {quota.toLocaleString()}
            </span>
          </span>
          {resetsIn && (
            <span className="truncate text-xs text-muted-foreground">
              {resetsIn}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
