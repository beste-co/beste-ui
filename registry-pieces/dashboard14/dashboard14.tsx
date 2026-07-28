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

interface Dashboard14Props {
  label?: string;
  score?: number;
  status?: string;
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

const RADIUS = 32;
const SEMI = Math.PI * RADIUS;

export const dashboard14Demo: Dashboard14Props = {
  label: "System health",
  score: 82,
  status: "Healthy",
  tone: "emerald",
};

export function Dashboard14({
  label = "Score",
  score = 0,
  status,
  tone = "emerald",
  className,
}: Dashboard14Props) {
  const pct = Math.max(0, Math.min(100, score));
  const offset = SEMI * (1 - pct / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col items-center gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className={cn("relative h-12 w-24", arcClasses[tone])}>
          <svg
            viewBox="0 0 80 44"
            className="size-full"
            aria-hidden="true"
          >
            <path
              d="M 8 40 A 32 32 0 0 1 72 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-muted"
            />
            <path
              d="M 8 40 A 32 32 0 0 1 72 40"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={SEMI}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-x-0 bottom-0 text-center font-mono text-xl font-semibold tabular-nums text-card-foreground">
            {Math.round(pct)}
          </span>
        </div>
        {status && (
          <span className="text-xs text-muted-foreground">{status}</span>
        )}
      </div>
    </div>
  );
}
