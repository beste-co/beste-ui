"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event5Props {
  venue?: string;
  address?: string;
  city?: string;
  capacity?: string;
  directions?: string;
  bordered?: boolean;
  className?: string;
}

export const event5Demo: Event5Props = {
  venue: "Zorlu PSM · Grand Hall",
  address: "Levent · Beşiktaş",
  city: "Istanbul, Türkiye",
  bordered: false,
};

export function Event5({
  venue,
  address,
  city,
  capacity,
  directions,
  bordered = false,
  className,
}: Event5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-start gap-2">
          <MapPin
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            {venue && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {venue}
              </span>
            )}
            {address && (
              <span className="truncate text-sm text-muted-foreground">
                {address}
              </span>
            )}
            {city && (
              <span className="truncate text-sm text-muted-foreground">
                {city}
              </span>
            )}
          </div>
        </div>
        {(capacity || directions) && (
          <div className="flex items-center justify-between gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
            {capacity && (
              <span className="shrink-0 tabular-nums">{capacity}</span>
            )}
            {directions && (
              <span className="truncate text-right">{directions}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
