"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Stats2Props {
  value?: string;
  delta?: number;
  period?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const stats2Demo: Stats2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  value: "$48.2K",
  delta: 12.4,
  period: "vs last month",
};

export function Stats2({
  value,
  delta = 0,
  period,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Stats2Props) {
  const isUp = delta >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const trendColor = isUp
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-52 flex-col gap-1 rounded-lg px-4 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {value && (
          <span className="text-2xl font-bold tabular-nums">
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
            <span className="text-xs text-current/60">{period}</span>
          )}
        </div>
      </div>
    </div>
  );
}
