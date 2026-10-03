"use client";

import { cn } from "@/lib/utils";

interface Location4Props {
  latitude?: string;
  longitude?: string;
  place?: string;
  bordered?: boolean;
  className?: string;
}

export const location4Demo: Location4Props = {
  latitude: "40.7580° N",
  longitude: "73.9855° W",
  place: "Times Square, NY",
  bordered: false,
};

export function Location4({
  latitude,
  longitude,
  place,
  bordered = false,
  className,
}: Location4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-72 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="text-base font-semibold text-card-foreground">
          <div className="tabular-nums">{latitude}</div>
          <div className="tabular-nums">{longitude}</div>
        </div>
        {place && (
          <div className="mt-2 border-t border-dashed border-border pt-2 text-sm text-muted-foreground">
            {place}
          </div>
        )}
      </div>
    </div>
  );
}
