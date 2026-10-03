"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard29Metric {
  label: string;
  value: string;
  delta?: number;
}

interface Dashboard29Props {
  metrics?: Dashboard29Metric[];
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

export const dashboard29Demo: Dashboard29Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  metrics: [
    { label: "ARR", value: "$1.82M", delta: 8.4 },
    { label: "Churn", value: "2.1%", delta: -0.3 },
    { label: "NPS", value: "48", delta: 6 },
  ],
};

export function Dashboard29({ metrics = [], surface = "card", bordered = false, inverted = false, className }: Dashboard29Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 divide-x divide-border overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {metrics.map((m) => {
          const positive = typeof m.delta === "number" && m.delta >= 0;
          return (
            <div key={m.label} className="flex flex-1 flex-col gap-0.5 px-3 py-2">
              <span className="truncate text-xs text-current/60">
                {m.label}
              </span>
              <span className="text-base font-semibold tabular-nums">
                {m.value}
              </span>
              {typeof m.delta === "number" && (
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  )}
                >
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
