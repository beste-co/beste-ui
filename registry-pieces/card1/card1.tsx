"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Card1Props {
  label?: string;
  value?: string;
  trend?: number;
  direction?: "up" | "down";
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

export const card1Demo: Card1Props = {
  surface: "card",
  bordered: false,
  inverted: false,
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
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Card1Props) {
  const isUp = direction === "up";
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
        {label && (
          <span className="text-xs font-medium text-current/60">
            {label}
          </span>
        )}
        <div className="flex items-baseline justify-between gap-2">
          {value && (
            <span className="text-xl font-semibold tabular-nums">
              {value}
            </span>
          )}
          {typeof trend === "number" && (
            <span
              className={cn("text-xs font-semibold tabular-nums", trendColor)}
            >
              {isUp ? "+" : "−"}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
