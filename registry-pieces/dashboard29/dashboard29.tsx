"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard29Metric {
  label: string;
  value: string;
  delta?: number;
}

interface Dashboard29Props {
  metrics?: Dashboard29Metric[];
  className?: string;
}

export const dashboard29Demo: Dashboard29Props = {
  metrics: [
    { label: "ARR", value: "$1.82M", delta: 8.4 },
    { label: "Churn", value: "2.1%", delta: -0.3 },
    { label: "NPS", value: "48", delta: 6 },
  ],
};

export function Dashboard29({ metrics = [], className }: Dashboard29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 divide-x divide-border overflow-hidden rounded-md border border-border bg-card shadow-sm">
        {metrics.map((m) => {
          const positive = typeof m.delta === "number" && m.delta >= 0;
          const TrendIcon = positive ? TrendingUp : TrendingDown;
          return (
            <div key={m.label} className="flex flex-1 flex-col gap-0.5 px-3 py-2">
              <span className="truncate text-xs text-muted-foreground">
                {m.label}
              </span>
              <span className="font-mono text-base font-semibold tabular-nums text-card-foreground">
                {m.value}
              </span>
              {typeof m.delta === "number" && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 font-mono text-xs font-medium tabular-nums",
                    positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  <TrendIcon className="size-3" aria-hidden="true" />
                  {positive ? "+" : ""}
                  {m.delta}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
