"use client";

import {
  Cloud,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Condition = "sunny" | "cloudy" | "rainy" | "snowy" | "night";

interface Day {
  label: string;
  condition: Condition;
  high: number;
  low: number;
}

interface Weather2Props {
  days?: Day[];
  className?: string;
}

const iconMap: Record<Condition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  night: Moon,
};

const iconColorMap: Record<Condition, string> = {
  sunny: "text-amber-500",
  cloudy: "text-slate-500",
  rainy: "text-sky-500",
  snowy: "text-cyan-500",
  night: "text-indigo-400",
};

export const weather2Demo: Weather2Props = {
  days: [
    { label: "Mon", condition: "sunny", high: 24, low: 15 },
    { label: "Tue", condition: "cloudy", high: 22, low: 14 },
    { label: "Wed", condition: "rainy", high: 18, low: 12 },
    { label: "Thu", condition: "cloudy", high: 19, low: 13 },
    { label: "Fri", condition: "sunny", high: 25, low: 16 },
  ],
};

export function Weather2({ days = [], className }: Weather2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center justify-between gap-1 rounded-xl border border-border bg-card px-3 py-3 shadow-sm">
        {days.map((day) => {
          const Icon = iconMap[day.condition];
          return (
            <div
              key={day.label}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-xs font-medium text-muted-foreground">
                {day.label}
              </span>
              <Icon
                className={cn("size-5", iconColorMap[day.condition])}
                aria-hidden="true"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold tabular-nums text-card-foreground">
                  {day.high}°
                </span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {day.low}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
