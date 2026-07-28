"use client";

import { cn } from "@/lib/utils";

interface Money21Props {
  label?: string;
  amount?: string;
  delta?: string;
  bars?: number[];
  className?: string;
}

export const money21Demo: Money21Props = {
  label: "MRR",
  amount: "$48.2k",
  delta: "+12% MoM",
  bars: [38, 44, 41, 52, 58, 55, 67, 72, 70, 81, 88, 100],
};

export function Money21({
  label,
  amount = "$0",
  delta,
  bars = [],
  className,
}: Money21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {label && (
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            )}
            <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
              {amount}
            </span>
          </div>
          {delta && (
            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
              {delta}
            </span>
          )}
        </div>
        {bars.length > 0 && (
          <div className="flex h-10 items-end gap-1" aria-hidden="true">
            {bars.map((height, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-sm",
                  i === bars.length - 1 ? "bg-foreground" : "bg-muted"
                )}
                style={{ height: `${Math.max(6, Math.min(100, height))}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
