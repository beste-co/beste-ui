"use client";

import { Footprints } from "lucide-react";
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

interface Health4Props {
  steps?: number;
  goal?: number;
  distance?: string;
  kcal?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const pctClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-600 dark:text-sky-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
  amber: "text-amber-600 dark:text-amber-400",
  rose: "text-rose-600 dark:text-rose-400",
};

export const health4Demo: Health4Props = {
  steps: 8420,
  goal: 10000,
  distance: "6.4 km",
  kcal: "310 kcal",
  label: "Steps",
  tone: "emerald",
};

export function Health4({
  steps = 0,
  goal = 10000,
  distance,
  kcal,
  label = "Steps",
  tone = "emerald",
  className,
}: Health4Props) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round((steps / Math.max(1, goal)) * 100))
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Footprints className="size-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            of {goal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-card-foreground">
            {steps.toLocaleString()}
          </span>
          <span className={cn("text-xs font-semibold", pctClasses[tone])}>
            {pct}%
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {distance && <span>{distance}</span>}
          {kcal && <span>{kcal}</span>}
        </div>
      </div>
    </div>
  );
}
