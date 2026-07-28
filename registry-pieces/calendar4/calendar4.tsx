"use client";

import { cn } from "@/lib/utils";

interface Calendar4Props {
  weekday?: string;
  date?: string;
  time?: string;
  relative?: string;
  className?: string;
}

export const calendar4Demo: Calendar4Props = {
  weekday: "Thu",
  date: "Apr 23",
  time: "14:00",
  relative: "Today",
};

export function Calendar4({
  weekday,
  date,
  time,
  relative,
  className,
}: Calendar4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5 pl-2 shadow-sm">
        {relative && (
          <>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {relative}
            </span>
            <span
              className="h-3 w-px bg-border"
              aria-hidden="true"
            />
          </>
        )}
        {weekday && (
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {weekday}
          </span>
        )}
        {date && (
          <span className="font-mono text-sm font-bold text-card-foreground">
            {date}
          </span>
        )}
        {time && (
          <>
            <span
              className="h-3 w-px bg-border"
              aria-hidden="true"
            />
            <span className="font-mono text-sm text-muted-foreground">
              {time}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
