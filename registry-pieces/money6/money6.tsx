"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Money6Props {
  symbol?: string;
  name?: string;
  price?: string;
  delta?: number;
  data?: number[];
  className?: string;
}

export const money6Demo: Money6Props = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: "$218.42",
  delta: 1.8,
  data: [12, 18, 14, 22, 20, 28, 24, 32, 30, 38, 36, 44],
};

export function Money6({
  symbol = "TICK",
  name,
  price,
  delta = 0,
  data = [],
  className,
}: Money6Props) {
  const isUp = delta >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendClass = isUp
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  const width = 80;
  const height = 30;
  const points = (() => {
    if (data.length === 0) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : 0;
    return data
      .map((d, i) => {
        const x = i * step;
        const y = height - ((d - min) / range) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  })();

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-bold uppercase tracking-wide text-card-foreground">
              {symbol}
            </span>
            {name && (
              <span className="truncate text-xs text-muted-foreground">
                {name}
              </span>
            )}
          </div>
          <span className="text-lg font-semibold tabular-nums text-card-foreground">
            {price}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={cn("h-8 w-20", trendClass)}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums",
            trendClass
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          {isUp ? "+" : ""}
          {delta}%
        </span>
      </div>
    </div>
  );
}
