"use client";

import { cn } from "@/lib/utils";

interface Slot {
  time: string;
  disabled?: boolean;
}

interface Calendar11Props {
  heading?: string;
  date?: string;
  timezone?: string;
  slots?: Slot[];
  selectedIndex?: number;
  bordered?: boolean;
  className?: string;
}

export const calendar11Demo: Calendar11Props = {
  heading: "Book a 30-minute call",
  date: "Thursday, Apr 23",
  slots: [
    { time: "09:30" },
    { time: "10:00" },
    { time: "11:00", disabled: true },
    { time: "13:30" },
    { time: "14:00" },
    { time: "15:30" },
  ],
  selectedIndex: 3,
  bordered: false,
};

export function Calendar11({
  heading,
  date,
  timezone,
  slots = [],
  selectedIndex,
  bordered = false,
  className,
}: Calendar11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex flex-col">
          {heading && (
            <span className="text-sm font-semibold text-card-foreground">
              {heading}
            </span>
          )}
          {(date || timezone) && (
            <span className="text-xs text-muted-foreground">
              {[date, timezone].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              type="button"
              disabled={slot.disabled}
              className={cn(
                "rounded-md border px-2 py-1.5 text-xs font-semibold tabular-nums transition-colors",
                idx === selectedIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : slot.disabled
                    ? "border-border bg-muted text-muted-foreground line-through opacity-60"
                    : "border-border bg-card text-card-foreground hover:bg-muted"
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
