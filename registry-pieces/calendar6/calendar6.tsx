"use client";

import { cn } from "@/lib/utils";

interface Calendar6Day {
  weekday: string;
  day: number;
  today?: boolean;
  events?: number;
}

interface Calendar6Props {
  heading?: string;
  days?: Calendar6Day[];
  className?: string;
}

export const calendar6Demo: Calendar6Props = {
  heading: "Apr 20 – Apr 26",
  days: [
    { weekday: "Mon", day: 20, events: 2 },
    { weekday: "Tue", day: 21, events: 1 },
    { weekday: "Wed", day: 22 },
    { weekday: "Thu", day: 23, today: true, events: 3 },
    { weekday: "Fri", day: 24, events: 1 },
    { weekday: "Sat", day: 25 },
    { weekday: "Sun", day: 26, events: 2 },
  ],
};

export function Calendar6({
  heading,
  days = [],
  className,
}: Calendar6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div className="flex items-stretch justify-between gap-1">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg border px-1 py-2",
                d.today
                  ? "border-primary bg-primary/10"
                  : "border-border"
              )}
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {d.weekday}
              </span>
              <span
                className={cn(
                  "font-mono text-base font-semibold",
                  d.today ? "text-primary" : "text-card-foreground"
                )}
              >
                {d.day}
              </span>
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: d.events ?? 0 }).map((_, i) => (
                  <span
                    key={i}
                    className="size-1 rounded-full bg-sky-500"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
