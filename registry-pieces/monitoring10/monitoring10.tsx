"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

type Trend = "up" | "down" | "flat";

interface Monitoring10Props {
  label?: string;
  value?: string;
  unit?: string;
  delta?: string;
  trend?: Trend;
  tone?: Tone;
  className?: string;
}

const trendIcon: Record<Trend, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const deltaClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export const monitoring10Demo: Monitoring10Props = {
  label: "Requests",
  value: "12.4K",
  unit: "req/s",
  delta: "+12%",
  trend: "up",
  tone: "emerald",
};

export function Monitoring10({
  label = "Throughput",
  value = "0",
  unit,
  delta,
  trend = "up",
  tone = "emerald",
  className,
}: Monitoring10Props) {
  const Icon = trendIcon[trend];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
              deltaClasses[tone]
            )}
          >
            <Icon className="size-3" aria-hidden="true" />
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
