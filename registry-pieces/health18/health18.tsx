"use client";

import { cn } from "@/lib/utils";

interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  done?: boolean;
  rest?: boolean;
}

interface Health18Props {
  week?: string;
  days?: WorkoutDay[];
  className?: string;
}

export const health18Demo: Health18Props = {
  week: "Training · Week 6",
  days: [
    { day: "Mon", focus: "Push", duration: "55 m", done: true },
    { day: "Tue", focus: "Pull", duration: "50 m", done: true },
    { day: "Wed", focus: "Rest", duration: "—", rest: true },
    { day: "Thu", focus: "Legs", duration: "65 m" },
    { day: "Fri", focus: "Cardio", duration: "30 m" },
    { day: "Sat", focus: "Rest", duration: "—", rest: true },
    { day: "Sun", focus: "Mobility", duration: "25 m" },
  ],
};

export function Health18({
  week,
  days = [],
  className,
}: Health18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {week && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {week}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {days.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5 text-sm"
            >
              <span className="w-8 shrink-0 font-semibold uppercase tracking-wide text-xs text-muted-foreground">
                {d.day}
              </span>
              <span
                className={cn(
                  "flex-1 truncate font-medium",
                  d.rest
                    ? "italic text-muted-foreground"
                    : "text-card-foreground"
                )}
              >
                {d.focus}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {d.duration}
              </span>
              {d.done && (
                <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Done
                </span>
              )}
              {!d.done && !d.rest && (
                <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  Planned
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
