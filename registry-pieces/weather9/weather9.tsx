"use client";

import { cn } from "@/lib/utils";

type Level = "good" | "moderate" | "unhealthy" | "very-unhealthy" | "hazardous";

interface Pollutant {
  name: string;
  value: string;
}

interface Weather9Props {
  aqi?: number;
  level?: Level;
  pollutants?: Pollutant[];
  bordered?: boolean;
  className?: string;
}

const levelClasses: Record<Level, string> = {
  good: "bg-emerald-500 text-white",
  moderate: "bg-amber-500 text-white",
  unhealthy: "bg-orange-500 text-white",
  "very-unhealthy": "bg-rose-500 text-white",
  hazardous: "bg-purple-500 text-white",
};

const levelLabel: Record<Level, string> = {
  good: "Good",
  moderate: "Moderate",
  unhealthy: "Unhealthy",
  "very-unhealthy": "Very Unhealthy",
  hazardous: "Hazardous",
};

export const weather9Demo: Weather9Props = {
  aqi: 42,
  level: "good",
  bordered: false,
};

export function Weather9({
  aqi,
  level = "good",
  pollutants = [],
  bordered = false,
  className,
}: Weather9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-72 rounded-xl bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-lg text-lg font-bold tabular-nums shadow-sm",
              levelClasses[level]
            )}
          >
            {aqi}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold text-card-foreground">
              {levelLabel[level]}
            </span>
            <span className="text-xs text-muted-foreground">US AQI</span>
          </div>
        </div>
        {pollutants.length > 0 && (
          <div className="mt-3 flex items-center gap-3 border-t border-border pt-2 text-xs">
            {pollutants.map((p, i) => (
              <span key={i} className="flex items-baseline gap-1">
                <span className="text-muted-foreground">{p.name}</span>
                <span className="font-semibold tabular-nums text-card-foreground">
                  {p.value}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
