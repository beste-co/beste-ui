"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard1Props {
  label?: string;
  value?: string;
  delta?: number;
  period?: string;
  className?: string;
}

export const dashboard1Demo: Dashboard1Props = {
  label: "MRR",
  value: "$48.2K",
  delta: 12.4,
  period: "vs last month",
};

export function Dashboard1({
  label = "Metric",
  value = "—",
  delta,
  period,
  className,
}: Dashboard1Props) {
  const positive = typeof delta === "number" && delta >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-2xl font-semibold tabular-nums text-card-foreground">
          {value}
        </span>
        {typeof delta === "number" && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-medium",
                positive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              )}
            >
              <TrendIcon className="size-3" aria-hidden="true" />
              {positive ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
            {period && (
              <span className="truncate text-muted-foreground">{period}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
