"use client";

import { cn } from "@/lib/utils";

interface PrecipHour {
  label: string;
  chance: number;
}

interface Weather7Props {
  hours?: PrecipHour[];
  className?: string;
}

export const weather7Demo: Weather7Props = {
  hours: [
    { label: "Now", chance: 10 },
    { label: "11", chance: 25 },
    { label: "12", chance: 60 },
    { label: "1", chance: 95 },
    { label: "2", chance: 78 },
    { label: "3", chance: 35 },
  ],
};

export function Weather7({ hours = [], className }: Weather7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 rounded-xl border border-border bg-card px-3 py-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Precipitation
          </span>
          <span className="text-xs text-muted-foreground">Next 6h</span>
        </div>
        <div className="flex items-end justify-between gap-1.5">
          {hours.map((h, i) => {
            const clamped = Math.max(0, Math.min(100, h.chance));
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs tabular-nums text-card-foreground">
                  {clamped}%
                </span>
                <div className="flex h-12 w-full items-end overflow-hidden rounded-sm bg-muted">
                  <div
                    className="w-full rounded-sm bg-sky-500"
                    style={{ height: `${clamped}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="text-xs text-muted-foreground">{h.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
