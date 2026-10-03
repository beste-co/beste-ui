"use client";

import { cn } from "@/lib/utils";

interface WorkoutDay {
  day: string;
  focus: string;
  duration?: string;
  done?: boolean;
  rest?: boolean;
}

interface Health18Props {
  week?: string;
  days?: WorkoutDay[];
  bordered?: boolean;
  className?: string;
}

export const health18Demo: Health18Props = {
  days: [
    { day: "Mon", focus: "Push", done: true },
    { day: "Tue", focus: "Pull", done: true },
    { day: "Wed", focus: "Rest", rest: true },
    { day: "Thu", focus: "Legs" },
  ],
  bordered: false,
};

export function Health18({
  week,
  days = [],
  bordered = false,
  className,
}: Health18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {week && (
          <span className="text-xs font-semibold text-muted-foreground">
            {week}
          </span>
        )}
        <div className="flex flex-col divide-y divide-border">
          {days.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5 text-sm"
            >
              <span className="w-8 shrink-0 font-semibold text-xs text-muted-foreground">
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
              {d.duration && (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {d.duration}
                </span>
              )}
              {d.done && (
                <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Done
                </span>
              )}
              {!d.done && !d.rest && (
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs text-muted-foreground", bordered ? "border border-border" : "bg-muted")}>
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
