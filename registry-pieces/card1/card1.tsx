"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card1Props {
  label?: string;
  value?: string;
  trend?: number;
  direction?: "up" | "down";
  className?: string;
}

export const card1Demo: Card1Props = {
  label: "Monthly revenue",
  value: "$12,459",
  trend: 24,
  direction: "up",
};

export function Card1({
  label,
  value,
  trend,
  direction = "up",
  className,
}: Card1Props) {
  const isUp = direction === "up";
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
        {label && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex items-baseline justify-between gap-2">
          {value && (
            <span className="text-xl font-semibold tabular-nums text-card-foreground">
              {value}
            </span>
          )}
          {typeof trend === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                trendColor
              )}
            >
              <TrendIcon className="size-3" aria-hidden="true" />
              {isUp ? "+" : "−"}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
