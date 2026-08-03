"use client";

import { cn } from "@/lib/utils";

interface DayCell {
  weekday: string;
  date: string;
  slots?: number;
}

interface Calendar32Props {
  title?: string;
  month?: string;
  days?: DayCell[];
  selectedIndex?: number;
  caption?: string;
  className?: string;
}

export const calendar32Demo: Calendar32Props = {
  title: "Pick a day",
  month: "May",
  days: [
    { weekday: "M", date: "12", slots: 4 },
    { weekday: "T", date: "13", slots: 2 },
    { weekday: "W", date: "14", slots: 6 },
    { weekday: "T", date: "15", slots: 0 },
    { weekday: "F", date: "16", slots: 3 },
    { weekday: "S", date: "17", slots: 1 },
    { weekday: "S", date: "18", slots: 0 },
  ],
  selectedIndex: 2,
  caption: "6 slots open on Wednesday, from 08:00 to 16:30.",
};

export function Calendar32({
  title,
  month,
  days = [],
  selectedIndex = 0,
  caption,
  className,
}: Calendar32Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-96 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="flex items-baseline justify-between gap-3">
          {title && <p className="text-base font-semibold text-card-foreground">{title}</p>}
          {month && <span className="text-sm text-muted-foreground">{month}</span>}
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {days.map((day, index) => {
            const selected = index === selectedIndex;
            const full = day.slots === 0;

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border py-2",
                  selected && "border-primary bg-primary text-primary-foreground",
                  !selected && full && "border-border bg-muted text-muted-foreground",
                  !selected && !full && "border-border bg-card text-card-foreground"
                )}
              >
                <span className={cn("text-xs", selected ? "opacity-80" : "text-muted-foreground")}>
                  {day.weekday}
                </span>
                <span className="text-sm font-medium tabular-nums">{day.date}</span>
                <span
                  className={cn(
                    "size-1 rounded-full",
                    selected ? "bg-primary-foreground" : full ? "bg-transparent" : "bg-primary"
                  )}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {caption && (
          <p className="mt-4 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
