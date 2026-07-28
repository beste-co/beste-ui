"use client";

import { Car, Fuel, Gauge, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel17Props {
  model?: string;
  category?: string;
  seats?: number;
  transmission?: string;
  fuel?: string;
  pricePerDay?: string;
  className?: string;
}

export const travel17Demo: Travel17Props = {
  model: "Volkswagen Golf or similar",
  category: "Economy",
  seats: 5,
  transmission: "Automatic",
  fuel: "Petrol",
  pricePerDay: "$34 / day",
};

export function Travel17({
  model,
  category,
  seats,
  transmission,
  fuel,
  pricePerDay,
  className,
}: Travel17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-md bg-slate-500/15 text-slate-600 dark:text-slate-300">
            <Car className="size-5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {model && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {model}
              </span>
            )}
            {category && (
              <span className="text-xs text-muted-foreground">{category}</span>
            )}
          </div>
          {pricePerDay && (
            <span className="shrink-0 font-mono text-sm font-bold text-card-foreground">
              {pricePerDay}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-muted/60 p-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3" aria-hidden="true" />
            {seats} seats
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Gauge className="size-3" aria-hidden="true" />
            {transmission}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Fuel className="size-3" aria-hidden="true" />
            {fuel}
          </div>
        </div>
      </div>
    </div>
  );
}
