"use client";

import { Cloud, CloudRain, CloudSnow, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type Condition = "sunny" | "cloudy" | "rainy" | "snowy" | "night";

interface Weather4Props {
  city?: string;
  temp?: number;
  feels?: number;
  high?: number;
  low?: number;
  condition?: Condition;
  conditionLabel?: string;
  unit?: "C" | "F";
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

const conditionDefaultLabel: Record<Condition, string> = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowing",
  night: "Clear night",
};

export const weather4Demo: Weather4Props = {
  city: "Istanbul",
  temp: 22,
  feels: 24,
  high: 25,
  low: 14,
  condition: "sunny",
  unit: "C",
};

export function Weather4({
  city,
  temp,
  feels,
  high,
  low,
  condition = "sunny",
  conditionLabel,
  unit = "C",
  className,
}: Weather4Props) {
  const Icon = iconMap[condition];
  const label = conditionLabel ?? conditionDefaultLabel[condition];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-64 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          {city && (
            <span className="truncate text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {city}
            </span>
          )}
          <Icon
            className={cn("size-7 shrink-0", iconColorMap[condition])}
            aria-hidden="true"
          />
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          {typeof temp === "number" && (
            <span className="text-5xl font-bold tabular-nums leading-none text-card-foreground">
              {temp}°
            </span>
          )}
          <span className="text-base text-muted-foreground">{unit}</span>
        </div>
        <div className="mt-1 text-sm text-card-foreground">{label}</div>
        <div className="mt-1 flex items-center gap-2 text-xs tabular-nums text-muted-foreground">
          {typeof high === "number" && <span>H:{high}°</span>}
          {typeof low === "number" && <span>L:{low}°</span>}
          {typeof feels === "number" && <span>· Feels {feels}°</span>}
        </div>
      </div>
    </div>
  );
}
