"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Calendar5Props {
  month?: string;
  year?: string;
  rangeStart?: number;
  rangeEnd?: number;
  firstDayOffset?: number;
  daysInMonth?: number;
  weekdays?: string[];
  nightsLabel?: string;
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

export const calendar5Demo: Calendar5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  month: "June",
  year: "2026",
  rangeStart: 12,
  rangeEnd: 18,
  firstDayOffset: 0,
  daysInMonth: 30,
  weekdays: DEFAULT_WEEKDAYS,
  nightsLabel: "nights",
};

export function Calendar5({
  month,
  year,
  rangeStart = 1,
  rangeEnd = 1,
  firstDayOffset = 0,
  daysInMonth = 30,
  weekdays = DEFAULT_WEEKDAYS,
  nightsLabel = "nights",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar5Props) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const nights = Math.max(0, rangeEnd - rangeStart);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {month}{" "}
            <span className="font-normal text-current/60">{year}</span>
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {nights} {nightsLabel}
          </span>
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
          {cells.map((d, idx) => {
            const isStart = d === rangeStart;
            const isEnd = d === rangeEnd;
            const inRange = d !== null && d > rangeStart && d < rangeEnd;
            return (
              <div
                key={idx}
                className={cn(
                  "relative flex h-8 items-center justify-center py-0.5 font-mono text-sm",
                  inRange && "bg-primary/15",
                  isStart && "rounded-l-full bg-primary/15",
                  isEnd && "rounded-r-full bg-primary/15"
                )}
              >
                {d && (
                  <span
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full tabular-nums",
                      (isStart || isEnd) &&
                        "bg-primary font-semibold text-primary-foreground",
                      !isStart && !isEnd && !inRange && ""
                    )}
                  >
                    {d}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
