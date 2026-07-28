"use client";

import { cn } from "@/lib/utils";

interface Event4Props {
  title?: string;
  startsAt?: string;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
  className?: string;
}

export const event4Demo: Event4Props = {
  title: "Shipmas 2026",
  startsAt: "Dec 1 · 09:00 UTC",
  days: 42,
  hours: 8,
  minutes: 21,
  seconds: 11,
  daysLabel: "days",
  hoursLabel: "hrs",
  minutesLabel: "min",
  secondsLabel: "sec",
};

export function Event4({
  title,
  startsAt,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  daysLabel = "days",
  hoursLabel = "hrs",
  minutesLabel = "min",
  secondsLabel = "sec",
  className,
}: Event4Props) {
  const units = [
    { value: days, label: daysLabel },
    { value: hours, label: hoursLabel },
    { value: minutes, label: minutesLabel },
    { value: seconds, label: secondsLabel },
  ];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl bg-foreground p-3 text-background shadow-md">
        <div className="flex flex-col">
          {title && (
            <span className="text-sm font-bold">{title}</span>
          )}
          {startsAt && (
            <span className="text-xs text-background/70">{startsAt}</span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {units.map((u, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-0.5 rounded-lg bg-background/10 py-2"
            >
              <span className="font-mono text-xl font-bold">
                {u.value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-background/70">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
