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

interface Day {
  label: string;
  condition: Condition;
  high: number;
  low: number;
}

interface Weather2Props {
  days?: Day[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
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

export const weather2Demo: Weather2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  days: [
    { label: "Mon", condition: "sunny", high: 24, low: 15 },
    { label: "Tue", condition: "cloudy", high: 22, low: 14 },
    { label: "Wed", condition: "rainy", high: 18, low: 12 },
    { label: "Thu", condition: "cloudy", high: 19, low: 13 },
    { label: "Fri", condition: "sunny", high: 25, low: 16 },
  ],
};

export function Weather2({ days = [], surface = "card", bordered = true, inverted = false, className }: Weather2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center justify-between gap-1 rounded-xl px-3 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {days.map((day) => {
          const Icon = iconMap[day.condition];
          return (
            <div
              key={day.label}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-xs font-medium text-current/60">
                {day.label}
              </span>
              <Icon
                className={cn("size-5", iconColorMap[day.condition])}
                aria-hidden="true"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold tabular-nums">
                  {day.high}°
                </span>
                <span className="text-xs tabular-nums text-current/60">
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
