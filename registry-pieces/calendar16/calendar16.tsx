"use client";

import { cn } from "@/lib/utils";

interface Calendar16Props {
  month?: string;
  year?: string;
  firstDayOffset?: number;
  daysInMonth?: number;
  eventsByDay?: Record<number, ("work" | "personal" | "health")[]>;
  today?: number;
  className?: string;
}

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

const typeClasses = {
  work: "bg-sky-500",
  personal: "bg-violet-500",
  health: "bg-emerald-500",
};

export const calendar16Demo: Calendar16Props = {
  month: "April",
  year: "2026",
  firstDayOffset: 3,
  daysInMonth: 30,
  today: 23,
  eventsByDay: {
    3: ["work"],
    8: ["work", "personal"],
    14: ["health"],
    20: ["work", "work", "health"],
    23: ["work", "personal", "health"],
    28: ["personal"],
  },
};

export function Calendar16({
  month,
  year,
  firstDayOffset = 0,
  daysInMonth = 30,
  eventsByDay = {},
  today,
  className,
}: Calendar16Props) {
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
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <span className="text-sm font-semibold text-card-foreground">
          {month} {year}
        </span>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((w, idx) => (
            <span
              key={idx}
              className="text-xs font-medium text-muted-foreground"
            >
              {w}
            </span>
          ))}
          {cells.map((d, idx) => {
            const events = d ? eventsByDay[d] ?? [] : [];
            const isToday = d === today;
            return (
              <div
                key={idx}
                className={cn(
                  "flex aspect-square flex-col items-center justify-start gap-0.5 rounded-md p-0.5 font-mono text-xs",
                  isToday
                    ? "bg-primary font-bold text-primary-foreground"
                    : d
                      ? "text-card-foreground hover:bg-muted"
                      : ""
                )}
              >
                {d ?? ""}
                {d && events.length > 0 && (
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    {events.slice(0, 3).map((e, eIdx) => (
                      <span
                        key={eIdx}
                        className={cn(
                          "size-1 rounded-full",
                          typeClasses[e]
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
