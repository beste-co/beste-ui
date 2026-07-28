"use client";

import { Cloud, CloudRain, CloudSnow, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type Condition = "sunny" | "cloudy" | "rainy" | "snowy" | "night";

interface Hour {
  label: string;
  condition: Condition;
  temp: number;
}

interface Weather3Props {
  hours?: Hour[];
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

export const weather3Demo: Weather3Props = {
  hours: [
    { label: "Now", condition: "sunny", temp: 22 },
    { label: "10 AM", condition: "sunny", temp: 23 },
    { label: "11 AM", condition: "cloudy", temp: 24 },
    { label: "12 PM", condition: "cloudy", temp: 24 },
    { label: "1 PM", condition: "rainy", temp: 21 },
    { label: "2 PM", condition: "rainy", temp: 20 },
  ],
};

export function Weather3({ hours = [], className }: Weather3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between gap-1 rounded-xl border border-border bg-card px-3 py-3 shadow-sm">
        {hours.map((hour, i) => {
          const Icon = iconMap[hour.condition];
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                {hour.label}
              </span>
              <Icon
                className={cn("size-5", iconColorMap[hour.condition])}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold tabular-nums text-card-foreground">
                {hour.temp}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
