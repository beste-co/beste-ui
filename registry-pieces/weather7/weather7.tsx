"use client";

import { cn } from "@/lib/utils";

interface PrecipHour {
  label: string;
  chance: number;
}

interface Weather7Props {
  hours?: PrecipHour[];
  bordered?: boolean;
  className?: string;
}

export const weather7Demo: Weather7Props = {
  hours: [
    { label: "Now", chance: 10 },
    { label: "11", chance: 25 },
    { label: "12", chance: 60 },
    { label: "1", chance: 95 },
  ],
  bordered: false,
};

export function Weather7({ hours = [], bordered = false, className }: Weather7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-72 rounded-xl bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <span className="mb-2 block text-xs font-semibold text-muted-foreground">
          Precipitation
        </span>
        <div className="flex items-end justify-between gap-1.5">
          {hours.map((h, i) => {
            const clamped = Math.max(0, Math.min(100, h.chance));
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-12 w-full items-end overflow-hidden rounded-sm bg-muted">
                  <div
                    className="w-full rounded-sm bg-sky-500"
                    style={{ height: `${clamped}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">{h.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
