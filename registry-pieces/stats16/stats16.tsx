"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Direction = "up" | "down";

interface Stats16Props {
  label?: string;
  value?: string;
  delta?: string;
  direction?: Direction;
  caption?: string;
  bars?: number[];
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

export const stats16Demo: Stats16Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Visits this month",
  value: "1,284",
  delta: "12.4%",
  direction: "up",
  caption: "vs. 1,142 last month",
  bars: [38, 52, 44, 61, 55, 72, 68, 86],
};

export function Stats16({
  label,
  value,
  delta,
  direction = "up",
  caption,
  bars = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Stats16Props) {
  const peak = Math.max(...bars, 1);
  const Trend = direction === "up" ? TrendingUp : TrendingDown;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-72 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        {label && <p className="text-sm text-current/60">{label}</p>}

        <div className="mt-1 flex items-baseline gap-2">
          {value && (
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {value}
            </span>
          )}
          {delta && (
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                direction === "up" ? "text-emerald-500" : "text-rose-500"
              )}
            >
              <Trend className="size-3.5" aria-hidden="true" />
              {delta}
            </span>
          )}
        </div>

        {bars.length > 0 && (
          <div className="mt-4 flex h-10 items-end gap-1" aria-hidden="true">
            {bars.map((bar, index) => (
              <span
                key={index}
                className={cn(
                  "flex-1 rounded-sm",
                  index === bars.length - 1 ? "bg-primary" : "bg-primary/20"
                )}
                style={{ height: `${Math.max((bar / peak) * 100, 8)}%` }}
              />
            ))}
          </div>
        )}

        {caption && <p className="mt-3 text-sm text-current/60">{caption}</p>}
      </div>
    </div>
  );
}
