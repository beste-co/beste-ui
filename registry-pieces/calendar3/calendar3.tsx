"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Calendar3Props {
  month?: string;
  year?: string;
  today?: number;
  firstDayOffset?: number;
  daysInMonth?: number;
  weekdays?: string[];
  className?: string;
}

const DEFAULT_WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export const calendar3Demo: Calendar3Props = {
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
  className,
}: Calendar3Props) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-card-foreground">
            {month}{" "}
            <span className="font-normal text-muted-foreground">{year}</span>
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-card-foreground"
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
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
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
                      : "text-card-foreground hover:bg-muted"
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
