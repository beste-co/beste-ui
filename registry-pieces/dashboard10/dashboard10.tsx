"use client";

import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard10Props {
  label?: string;
  currentLabel?: string;
  currentValue?: string;
  previousLabel?: string;
  previousValue?: string;
  delta?: number;
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

export const dashboard10Demo: Dashboard10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Conversion rate",
  currentLabel: "This week",
  currentValue: "3.82%",
  previousLabel: "Last week",
  previousValue: "3.41%",
  delta: 12,
};

export function Dashboard10({
  label = "Metric",
  currentLabel = "Current",
  currentValue = "—",
  previousLabel = "Previous",
  previousValue = "—",
  delta,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard10Props) {
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {label}
          </span>
          {typeof delta === "number" && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 font-mono text-xs font-medium",
                positive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              )}
            >
              <TrendIcon className="size-3" aria-hidden="true" />
              {positive ? "+" : ""}
              {delta}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-current/60">
              {previousLabel}
            </span>
            <span className="font-mono text-lg tabular-nums text-current/60">
              {previousValue}
            </span>
          </div>
          <ArrowRight
            className="size-3.5 shrink-0 text-current/60"
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col">
            <span className="text-xs text-current/60">
              {currentLabel}
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums">
              {currentValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
