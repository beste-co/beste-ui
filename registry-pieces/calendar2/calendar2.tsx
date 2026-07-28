"use client";

import { cn } from "@/lib/utils";

interface Calendar2Props {
  month?: string;
  year?: number;
  startWeekday?: number;
  daysInMonth?: number;
  today?: number;
  highlights?: number[];
  weekdays?: string[];
  className?: string;
}

const DEFAULT_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const calendar2Demo: Calendar2Props = {
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
  className,
}: Calendar2Props) {
  const leading = Math.max(0, Math.min(6, startWeekday));
  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 flex-col gap-1.5 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-card-foreground">
            {month}
          </span>
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {year}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {weekdays.map((w, i) => (
            <span
              key={`wd-${i}`}
              className="text-xs font-medium text-muted-foreground/70"
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
                  !isToday && !isHighlight && "text-card-foreground"
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
