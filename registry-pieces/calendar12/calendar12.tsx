"use client";

import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Calendar12Props {
  label?: string;
  targetDate?: string;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const calendar12Demo: Calendar12Props = {
  label: "Launch countdown",
  targetDate: "May 1, 2026 · 09:00 UTC",
  days: 8,
  hours: 11,
  minutes: 42,
  seconds: 7,
  tone: "neutral",
};

export function Calendar12({
  label,
  targetDate,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  tone = "neutral",
  className,
}: Calendar12Props) {
  const units = [
    { label: "days", value: days },
    { label: "hrs", value: hours },
    { label: "min", value: minutes },
    { label: "sec", value: seconds },
  ];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <CalendarClock className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {label && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {label}
              </span>
            )}
            {targetDate && (
              <span className="truncate text-xs text-muted-foreground">
                {targetDate}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {units.map((u, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-0.5 rounded-lg bg-muted py-2"
            >
              <span className="font-mono text-xl font-bold text-card-foreground">
                {u.value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
