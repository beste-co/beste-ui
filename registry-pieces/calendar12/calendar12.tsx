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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const calendar12Demo: Calendar12Props = {
  label: "Launch countdown",
  days: 8,
  hours: 11,
  minutes: 42,
  seconds: 7,
  tone: "neutral",
  bordered: false,
};

export function Calendar12({
  label,
  targetDate,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  tone = "neutral",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <CalendarClock
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
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
              <span className="text-xl font-bold tabular-nums text-card-foreground">
                {u.value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
