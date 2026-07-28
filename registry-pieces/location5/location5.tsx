"use client";

import { cn } from "@/lib/utils";

interface Location5Props {
  origin?: string;
  destination?: string;
  distance?: string;
  duration?: string;
  mode?: string;
  className?: string;
}

export const location5Demo: Location5Props = {
  origin: "Office · 5th Ave",
  destination: "Beste HQ · Brooklyn",
  distance: "4.2 mi",
  duration: "12 min",
  mode: "by car",
};

export function Location5({
  origin,
  destination,
  distance,
  duration,
  mode,
  className,
}: Location5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-72 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-1 p-3 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span className="truncate text-card-foreground">{origin}</span>
          </div>
          <div className="flex w-2 justify-center" aria-hidden="true">
            <span className="block h-3 w-px bg-border" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full bg-rose-500"
              aria-hidden="true"
            />
            <span className="truncate text-card-foreground">{destination}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {distance && (
            <span className="font-semibold text-card-foreground">
              {distance}
            </span>
          )}
          {distance && duration && (
            <span aria-hidden="true">·</span>
          )}
          {duration && <span>{duration}</span>}
          {mode && <span>{mode}</span>}
        </div>
      </div>
    </div>
  );
}
