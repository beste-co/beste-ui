"use client";

import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard10Props {
  label?: string;
  currentLabel?: string;
  currentValue?: string;
  previousLabel?: string;
  previousValue?: string;
  delta?: number;
  className?: string;
}

export const dashboard10Demo: Dashboard10Props = {
  label: "Conversion rate",
  currentLabel: "This week",
  currentValue: "3.82%",
  previousLabel: "Last week",
  previousValue: "3.41%",
  delta: 12,
};

export function Dashboard10({
  label = "Metric",
  currentLabel = "Current",
  currentValue = "—",
  previousLabel = "Previous",
  previousValue = "—",
  delta,
  className,
}: Dashboard10Props) {
  const positive = typeof delta === "number" && delta >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {typeof delta === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-mono text-xs font-medium",
                positive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              )}
            >
              <TrendIcon className="size-3" aria-hidden="true" />
              {positive ? "+" : ""}
              {delta}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-muted-foreground">
              {previousLabel}
            </span>
            <span className="font-mono text-lg tabular-nums text-muted-foreground">
              {previousValue}
            </span>
          </div>
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-muted-foreground">
              {currentLabel}
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums text-card-foreground">
              {currentValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
