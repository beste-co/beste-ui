"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

interface Tooltip6Props {
  date?: string;
  label?: string;
  value?: string;
  change?: string;
  trend?: Trend;
  className?: string;
}

const trendConfig: Record<Trend, { icon: typeof TrendingUp; pill: string }> = {
  up: {
    icon: TrendingUp,
    pill:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  down: {
    icon: TrendingDown,
    pill: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  },
  flat: {
    icon: TrendingUp,
    pill: "bg-muted text-muted-foreground",
  },
};

export const tooltip6Demo: Tooltip6Props = {
  date: "Mar 14, 2026",
  label: "Active users",
  value: "12,480",
  change: "+8.2%",
  trend: "up",
};

export function Tooltip6({
  date,
  label,
  value,
  change,
  trend = "up",
  className,
}: Tooltip6Props) {
  const config = trendConfig[trend];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
          {date && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {date}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            {value && (
              <span className="font-mono text-xl font-semibold text-card-foreground">
                {value}
              </span>
            )}
            {change && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  config.pill
                )}
              >
                <Icon className="size-3" aria-hidden="true" />
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
