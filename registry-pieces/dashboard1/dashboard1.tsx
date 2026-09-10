"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard1Props {
  label?: string;
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

export const dashboard1Demo: Dashboard1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "MRR",
  value: "$48.2K",
  delta: 12.4,
  period: "vs last month",
};

export function Dashboard1({
  label = "Metric",
  value = "—",
  delta,
  period,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard1Props) {
  const positive = typeof delta === "number" && delta >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
          {label}
        </span>
        <span className="font-mono text-2xl font-semibold tabular-nums">
          {value}
        </span>
        {typeof delta === "number" && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-medium",
                positive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              )}
            >
              <TrendIcon className="size-3" aria-hidden="true" />
              {positive ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
            {period && (
              <span className="truncate text-current/60">{period}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
