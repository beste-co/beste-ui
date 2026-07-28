"use client";

import { CalendarX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Calendar24Props {
  days?: { day: string; date: number; blocked?: boolean; off?: boolean }[];
  reason?: string;
  className?: string;
}

export const calendar24Demo: Calendar24Props = {
  days: [
    { day: "Mon", date: 27 },
    { day: "Tue", date: 28 },
    { day: "Wed", date: 29, blocked: true },
    { day: "Thu", date: 30, off: true },
    { day: "Fri", date: 1, off: true },
    { day: "Sat", date: 2 },
    { day: "Sun", date: 3 },
  ],
  reason: "Out of office · Apr 30 – May 1",
};

export function Calendar24({
  days = [],
  reason,
  className,
}: Calendar24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarX
            className="size-3.5 text-rose-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {reason}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-md p-1.5 text-xs",
                d.off
                  ? "bg-rose-500/15"
                  : d.blocked
                    ? "bg-amber-500/15"
                    : "bg-muted/60"
              )}
            >
              <span className="font-medium uppercase tracking-wide text-muted-foreground">
                {d.day}
              </span>
              <span
                className={cn(
                  "font-mono font-bold",
                  d.off
                    ? "text-rose-700 dark:text-rose-300 line-through"
                    : "text-card-foreground"
                )}
              >
                {d.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
