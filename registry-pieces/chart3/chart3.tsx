"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Chart3Props {
  label?: string;
  currentValue?: string;
  previousValue?: string;
  current?: number;
  previous?: number;
  currentLabel?: string;
  previousLabel?: string;
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

export const chart3Demo: Chart3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Revenue",
  currentValue: "$48.2K",
  previousValue: "$42.9K",
  current: 48.2,
  previous: 42.9,
  currentLabel: "This week",
  previousLabel: "Last week",
};

export function Chart3({
  label,
  currentValue,
  previousValue,
  current = 0,
  previous = 0,
  currentLabel = "This week",
  previousLabel = "Last week",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Chart3Props) {
  const max = Math.max(current, previous, 1);
  const currentPct = (current / max) * 100;
  const previousPct = (previous / max) * 100;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-56 flex-col gap-2 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {label && (
          <span className="text-xs font-medium uppercase tracking-wide text-current/60">
            {label}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 whitespace-nowrap text-xs text-current/60">
              {currentLabel}
            </span>
            <div
              className="h-4 rounded-sm bg-primary transition-all text-primary-foreground"
              style={{ width: `${currentPct}%` }}
              aria-hidden="true"
            />
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {currentValue}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 shrink-0 whitespace-nowrap text-xs text-current/60">
              {previousLabel}
            </span>
            <div
              className="h-4 rounded-sm bg-current/10 transition-all"
              style={{ width: `${previousPct}%` }}
              aria-hidden="true"
            />
            <span className="shrink-0 text-sm tabular-nums text-current/60">
              {previousValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
