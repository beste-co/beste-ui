"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats2Props {
  value?: string;
  delta?: number;
  period?: string;
  className?: string;
}

export const stats2Demo: Stats2Props = {
  value: "$48.2K",
  delta: 12.4,
  period: "vs last month",
};

export function Stats2({
  value,
  delta = 0,
  period,
  className,
}: Stats2Props) {
  const isUp = delta >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-52 flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        {value && (
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {value}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-sm font-semibold",
              trendColor
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden="true" />
            {isUp ? "+" : ""}
            {delta}%
          </span>
          {period && (
            <span className="text-xs text-muted-foreground">{period}</span>
          )}
        </div>
      </div>
    </div>
  );
}
