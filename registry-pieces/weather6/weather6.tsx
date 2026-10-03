"use client";

import { cn } from "@/lib/utils";

interface Weather6Props {
  sunrise?: string;
  sunset?: string;
  daylight?: string;
  dayProgress?: number;
  bordered?: boolean;
  className?: string;
}

export const weather6Demo: Weather6Props = {
  sunrise: "6:14 AM",
  sunset: "8:42 PM",
  dayProgress: 0.42,
  bordered: false,
};

export function Weather6({
  sunrise,
  sunset,
  daylight,
  dayProgress = 0.5,
  bordered = false,
  className,
}: Weather6Props) {
  const clamped = Math.max(0, Math.min(1, dayProgress));
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-72 rounded-xl bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between text-xs text-muted-foreground">
          <span>Sunrise</span>
          <span>Sunset</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between font-semibold tabular-nums text-card-foreground">
          <span>{sunrise}</span>
          <span>{sunset}</span>
        </div>
        <div className="relative mt-3 h-1 rounded-full bg-muted">
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500 shadow-sm"
            style={{ left: `${clamped * 100}%` }}
            aria-hidden="true"
          />
        </div>
        {daylight && (
          <div className="mt-3 text-center text-xs text-muted-foreground">
            Daylight {daylight}
          </div>
        )}
      </div>
    </div>
  );
}
