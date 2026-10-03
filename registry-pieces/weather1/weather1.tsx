"use client";

import {
  Cloud,
  CloudRain,
  CloudSnow,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const conditionConfig: Record<
  Condition,
  { icon: typeof Sun; label: string; iconColor: string }
> = {
  sunny: {
    icon: Sun,
    label: "Sunny",
    iconColor: "text-amber-500",
  },
  cloudy: {
    icon: Cloud,
    label: "Cloudy",
    iconColor: "text-slate-500",
  },
  rainy: {
    icon: CloudRain,
    label: "Rainy",
    iconColor: "text-sky-500",
  },
  snowy: {
    icon: CloudSnow,
    label: "Snowing",
    iconColor: "text-cyan-500",
  },
  night: {
    icon: Moon,
    label: "Clear night",
    iconColor: "text-indigo-400",
  },
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const weather1Demo: Weather1Props = {
  surface: "card",
  bordered: false,
  inverted: false,
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
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Weather1Props) {
  const config = conditionConfig[condition];
  const Icon = config.icon;
  const labelText = conditionLabel ?? config.label;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-xl px-4 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <Icon
          className={cn("size-7 shrink-0", config.iconColor)}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {city && (
            <span className="truncate text-xs font-medium text-current/60">
              {city}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            {typeof temp === "number" && (
              <span className="text-2xl font-bold tabular-nums leading-none">
                {temp}°
              </span>
            )}
            <span className="text-xs text-current/60">{unit}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-current/60">
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
