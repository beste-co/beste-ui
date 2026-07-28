"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Health19Props {
  label?: string;
  current?: string;
  goal?: string;
  fillPercent?: number;
  tone?: Tone;
  className?: string;
}

const bottleClasses: Record<Tone, string> = {
  neutral: "border-foreground/60 [&>div]:bg-foreground",
  primary: "border-primary/60 [&>div]:bg-primary",
  foreground: "border-foreground/60 [&>div]:bg-foreground",
  sky: "border-sky-500/60 [&>div]:bg-sky-500",
  emerald: "border-emerald-500/60 [&>div]:bg-emerald-500",
  violet: "border-violet-500/60 [&>div]:bg-violet-500",
  amber: "border-amber-500/60 [&>div]:bg-amber-500",
  rose: "border-rose-500/60 [&>div]:bg-rose-500",
};

const accentTextClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-600 dark:text-sky-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

export const health19Demo: Health19Props = {
  label: "Hydration",
  current: "1.8 L",
  goal: "2.5 L",
  fillPercent: 72,
  tone: "sky",
};

export function Health19({
  label = "Hydration",
  current,
  goal,
  fillPercent = 0,
  tone = "sky",
  className,
}: Health19Props) {
  const pct = Math.max(0, Math.min(100, fillPercent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div
          className={cn(
            "relative flex h-20 w-12 items-end justify-center overflow-hidden rounded-b-full rounded-t-md border-2",
            bottleClasses[tone]
          )}
        >
          <div
            className="w-full transition-all"
            style={{ height: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-card-foreground">
              {current}
            </span>
            <span className="text-xs text-muted-foreground">/ {goal}</span>
          </div>
          <span className={cn("text-xs", accentTextClasses[tone])}>
            {pct}% of daily goal
          </span>
        </div>
      </div>
    </div>
  );
}
