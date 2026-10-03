"use client";

import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

interface Tooltip6Props {
  date?: string;
  label?: string;
  value?: string;
  change?: string;
  trend?: Trend;
  bordered?: boolean;
  className?: string;
}

const trendPill: Record<Trend, string> = {
  up: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  down: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  flat: "bg-muted text-muted-foreground",
};

export const tooltip6Demo: Tooltip6Props = {
  date: "Mar 14, 2026",
  label: "Active users",
  value: "12,480",
  change: "+8.2%",
  trend: "up",
  bordered: false,
};

export function Tooltip6({
  date,
  label,
  value,
  change,
  trend = "up",
  bordered = false,
  className,
}: Tooltip6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className={cn("flex flex-col gap-1 rounded-lg bg-card px-3 py-2 shadow-lg", bordered && "border border-border")}>
          {date && (
            <span className="text-xs font-medium text-muted-foreground">
              {date}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            {value && (
              <span className="text-xl font-semibold tabular-nums text-card-foreground">
                {value}
              </span>
            )}
            {change && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                  trendPill[trend]
                )}
              >
                {change}
              </span>
            )}
          </div>
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
        <div
          className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-card"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
