"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const calendar32Demo: Calendar32Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Calendar32Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className={cn("w-full max-w-96 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-3">
          {title && <p className="text-base font-semibold">{title}</p>}
          {month && <span className="text-sm text-current/60">{month}</span>}
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
                  !selected && full && "border-current/15 bg-current/10 text-current/60",
                  !selected && !full && "border-current/15 bg-current/10"
                )}
              >
                <span className={cn("text-xs", selected ? "opacity-80" : "text-current/60")}>
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
          <p className="mt-4 border-t border-current/15 pt-3 text-sm leading-relaxed text-current/60">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
