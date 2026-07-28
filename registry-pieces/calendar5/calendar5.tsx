"use client";

import { cn } from "@/lib/utils";

interface Calendar5Props {
  month?: string;
  year?: string;
  rangeStart?: number;
  rangeEnd?: number;
  firstDayOffset?: number;
  daysInMonth?: number;
  weekdays?: string[];
  nightsLabel?: string;
  className?: string;
}

const DEFAULT_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const calendar5Demo: Calendar5Props = {
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
  className,
}: Calendar5Props) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const nights = Math.max(0, rangeEnd - rangeStart);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-card-foreground">
            {month}{" "}
            <span className="font-normal text-muted-foreground">{year}</span>
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {nights} {nightsLabel}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {weekdays.map((w, idx) => (
            <span
              key={idx}
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
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
                      !isStart && !isEnd && !inRange && "text-card-foreground"
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
