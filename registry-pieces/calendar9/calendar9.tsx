"use client";

import { Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface Calendar9Props {
  label?: string;
  days?: string[];
  activeDays?: string[];
  time?: string;
  endsOn?: string;
  className?: string;
}

export const calendar9Demo: Calendar9Props = {
  label: "Weekly standup",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  activeDays: ["Tue", "Thu", "Fri"],
  time: "09:30 – 09:45",
  endsOn: "Ends Dec 19, 2026",
};

export function Calendar9({
  label,
  days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  activeDays = [],
  time,
  endsOn,
  className,
}: Calendar9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-500">
            <Repeat className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {label && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {label}
              </span>
            )}
            {time && (
              <span className="truncate text-xs text-muted-foreground">
                {time}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {days.map((d, idx) => {
            const isActive = activeDays.includes(d);
            return (
              <span
                key={idx}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md text-xs font-semibold",
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {d.slice(0, 1)}
              </span>
            );
          })}
        </div>
        {endsOn && (
          <span className="text-xs text-muted-foreground">{endsOn}</span>
        )}
      </div>
    </div>
  );
}
