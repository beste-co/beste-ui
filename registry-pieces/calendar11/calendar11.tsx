"use client";

import { Clock } from "lucide-react";
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
  className?: string;
}

export const calendar11Demo: Calendar11Props = {
  heading: "Book a 30-minute call",
  date: "Thursday, Apr 23",
  timezone: "Europe/Istanbul (UTC+3)",
  slots: [
    { time: "09:30" },
    { time: "10:00" },
    { time: "11:00", disabled: true },
    { time: "13:30" },
    { time: "14:00" },
    { time: "15:30" },
  ],
  selectedIndex: 3,
};

export function Calendar11({
  heading,
  date,
  timezone,
  slots = [],
  selectedIndex,
  className,
}: Calendar11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex flex-col">
          {heading && (
            <span className="text-sm font-semibold text-card-foreground">
              {heading}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" aria-hidden="true" />
            {date} · {timezone}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {slots.map((slot, idx) => (
            <button
              key={idx}
              type="button"
              disabled={slot.disabled}
              className={cn(
                "rounded-md border px-2 py-1.5 font-mono text-xs font-semibold transition-colors",
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
