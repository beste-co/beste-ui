"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "flat";

interface Indicator8Props {
  direction?: Direction;
  value?: string;
  period?: string;
  className?: string;
}

const directionConfig: Record<
  Direction,
  { icon: typeof TrendingUp; text: string }
> = {
  up: {
    icon: TrendingUp,
    text: "text-emerald-700 dark:text-emerald-300",
  },
  down: {
    icon: TrendingDown,
    text: "text-rose-700 dark:text-rose-300",
  },
  flat: {
    icon: Minus,
    text: "text-muted-foreground",
  },
};

export const indicator8Demo: Indicator8Props = {
  direction: "up",
  value: "+12.4%",
  period: "vs last week",
};

export function Indicator8({
  direction = "flat",
  value,
  period,
  className,
}: Indicator8Props) {
  const config = directionConfig[direction];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-baseline gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-lg font-bold tabular-nums",
            config.text
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          {value}
        </span>
        {period && (
          <span className="text-xs text-muted-foreground">{period}</span>
        )}
      </div>
    </div>
  );
}
