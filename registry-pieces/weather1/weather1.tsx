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

interface Weather1Props {
  city?: string;
  temp?: number;
  high?: number;
  low?: number;
  condition?: Condition;
  conditionLabel?: string;
  highPrefix?: string;
  lowPrefix?: string;
  unit?: "C" | "F";
  className?: string;
}

const conditionConfig: Record<
  Condition,
  { icon: typeof Sun; label: string; iconColor: string; bubble: string }
> = {
  sunny: {
    icon: Sun,
    label: "Sunny",
    iconColor: "text-amber-500",
    bubble: "bg-amber-100 dark:bg-amber-950",
  },
  cloudy: {
    icon: Cloud,
    label: "Cloudy",
    iconColor: "text-slate-500",
    bubble: "bg-slate-100 dark:bg-slate-900",
  },
  rainy: {
    icon: CloudRain,
    label: "Rainy",
    iconColor: "text-sky-500",
    bubble: "bg-sky-100 dark:bg-sky-950",
  },
  snowy: {
    icon: CloudSnow,
    label: "Snowing",
    iconColor: "text-cyan-500",
    bubble: "bg-cyan-100 dark:bg-cyan-950",
  },
  night: {
    icon: Moon,
    label: "Clear night",
    iconColor: "text-indigo-400",
    bubble: "bg-indigo-100 dark:bg-indigo-950",
  },
};

export const weather1Demo: Weather1Props = {
  city: "Istanbul",
  temp: 18,
  high: 21,
  low: 12,
  condition: "cloudy",
  unit: "C",
  highPrefix: "H:",
  lowPrefix: "L:",
};

export function Weather1({
  city,
  temp,
  high,
  low,
  condition = "sunny",
  conditionLabel,
  highPrefix = "H:",
  lowPrefix = "L:",
  unit = "C",
  className,
}: Weather1Props) {
  const config = conditionConfig[condition];
  const Icon = config.icon;
  const labelText = conditionLabel ?? config.label;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-lg",
            config.bubble
          )}
        >
          <Icon
            className={cn("size-6", config.iconColor)}
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {city && (
            <span className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {city}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            {typeof temp === "number" && (
              <span className="text-2xl font-bold tabular-nums leading-none text-card-foreground">
                {temp}°
              </span>
            )}
            <span className="text-xs text-muted-foreground">{unit}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{labelText}</span>
            {(typeof high === "number" || typeof low === "number") && (
              <span className="tabular-nums">
                {typeof high === "number" && `${highPrefix}${high}°`}
                {typeof high === "number" && typeof low === "number" && " · "}
                {typeof low === "number" && `${lowPrefix}${low}°`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
