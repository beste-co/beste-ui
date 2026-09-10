"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Calendar2Props {
  month?: string;
  year?: number;
  startWeekday?: number;
  daysInMonth?: number;
  today?: number;
  highlights?: number[];
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

export const calendar2Demo: Calendar2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  month: "April",
  year: 2026,
  startWeekday: 2,
  daysInMonth: 30,
  today: 21,
  highlights: [7, 14, 28],
  weekdays: DEFAULT_WEEKDAYS,
};

export function Calendar2({
  month = "Month",
  year = new Date().getFullYear(),
  startWeekday = 0,
  daysInMonth = 30,
  today,
  highlights = [],
  weekdays = DEFAULT_WEEKDAYS,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar2Props) {
  const leading = Math.max(0, Math.min(6, startWeekday));
  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-60 flex-col gap-1.5 rounded-lg p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">
            {month}
          </span>
          <span className="text-xs font-mono tabular-nums text-current/60">
            {year}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {weekdays.map((w, i) => (
            <span
              key={`wd-${i}`}
              className="text-xs font-medium text-current/40"
              aria-hidden="true"
            >
              {w}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) {
              return <span key={`empty-${i}`} aria-hidden="true" />;
            }
            const isToday = day === today;
            const isHighlight = highlights.includes(day);
            return (
              <span
                key={day}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md text-xs tabular-nums",
                  isToday && "bg-foreground font-bold text-background",
                  !isToday && isHighlight && "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 font-semibold",
                  !isToday && !isHighlight && ""
                )}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
