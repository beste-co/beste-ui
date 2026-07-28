"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type EventTone = "primary" | "emerald" | "amber" | "rose" | "violet";

export interface CalendarEvent {
  day: number;
  tone?: EventTone;
}

interface CalendarMonthProps {
  /** Header label, e.g. "January 2026" */
  monthLabel: string;
  /** Weekday index (0=Sun … 6=Sat) that the 1st falls on */
  weekStart: number;
  daysInMonth: number;
  /** Colored dots under specific days */
  events?: CalendarEvent[];
  /** Day number to mark as today */
  today?: number;
  /** Controlled selected day */
  selectedDay?: number;
  defaultSelectedDay?: number;
  onSelectDay?: (day: number) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toneDot: Record<EventTone, string> = {
  primary: "bg-primary",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
};

export const calendarMonthDemo: CalendarMonthProps = {
  monthLabel: "January 2026",
  weekStart: 4,
  daysInMonth: 31,
  today: 20,
  defaultSelectedDay: 21,
  events: [
    { day: 6, tone: "rose" },
    { day: 12, tone: "emerald" },
    { day: 16, tone: "amber" },
    { day: 20, tone: "rose" },
    { day: 22, tone: "primary" },
    { day: 25, tone: "violet" },
  ],
};

export function CalendarMonth({
  monthLabel,
  weekStart,
  daysInMonth,
  events = [],
  today,
  selectedDay,
  defaultSelectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  className,
}: CalendarMonthProps) {
  const [internalSelected, setInternalSelected] = useState(defaultSelectedDay);
  const selected = selectedDay ?? internalSelected;

  const eventsByDay = new Map<number, EventTone>();
  for (const event of events) {
    eventsByDay.set(event.day, event.tone ?? "primary");
  }

  const leading = Array.from({ length: weekStart }, (_, i) => `blank-${i}`);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSelect = (day: number) => {
    setInternalSelected(day);
    onSelectDay?.(day);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((weekday) => (
          <div
            key={weekday}
            className="pb-2 text-sm font-medium text-muted-foreground"
          >
            {weekday}
          </div>
        ))}
        {leading.map((key) => (
          <div key={key} />
        ))}
        {days.map((day) => {
          const isSelected = selected === day;
          const isToday = today === day;
          const tone = eventsByDay.get(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleSelect(day)}
              aria-current={isSelected ? "date" : undefined}
              className="flex flex-col items-center gap-1 py-1"
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-sm tabular-nums transition-colors",
                  isSelected
                    ? "bg-primary font-semibold text-primary-foreground"
                    : isToday
                      ? "bg-muted font-semibold text-foreground"
                      : "text-foreground hover:bg-muted"
                )}
              >
                {day}
              </span>
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  tone && !isSelected ? toneDot[tone] : "bg-transparent"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
