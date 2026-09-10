"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Calendar3Props {
  month?: string;
  year?: string;
  today?: number;
  firstDayOffset?: number;
  daysInMonth?: number;
  weekdays?: string[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const DEFAULT_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];


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

export const calendar3Demo: Calendar3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  month: "April",
  year: "2026",
  today: 23,
  firstDayOffset: 2,
  daysInMonth: 30,
  weekdays: DEFAULT_WEEKDAYS,
};

export function Calendar3({
  month,
  year,
  today = 1,
  firstDayOffset = 0,
  daysInMonth = 30,
  weekdays = DEFAULT_WEEKDAYS,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar3Props) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-3 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {month}{" "}
            <span className="font-normal text-current/60">{year}</span>
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded text-current/60 hover:bg-current/10 hover:text-current"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded text-current/60 hover:bg-current/10 hover:text-current"
              aria-label="Next month"
            >
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {weekdays.map((w, idx) => (
            <span
              key={idx}
              className="text-xs font-medium uppercase tracking-wide text-current/60"
            >
              {w}
            </span>
          ))}
          {cells.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center py-0.5"
            >
              {d === null ? (
                <span className="size-7" aria-hidden="true" />
              ) : (
                <button
                  type="button"
                  aria-current={d === today ? "date" : undefined}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full font-mono text-sm tabular-nums",
                    d === today
                      ? "bg-foreground font-semibold text-background"
                      : "hover:bg-current/10"
                  )}
                >
                  {d}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
