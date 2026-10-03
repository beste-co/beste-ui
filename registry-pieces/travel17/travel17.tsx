"use client";

import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel17Props {
  model?: string;
  category?: string;
  seats?: number;
  transmission?: string;
  fuel?: string;
  pricePerDay?: string;
  bordered?: boolean;
  className?: string;
}

export const travel17Demo: Travel17Props = {
  model: "Volkswagen Golf or similar",
  seats: 5,
  transmission: "Automatic",
  fuel: "Petrol",
  pricePerDay: "$34 / day",
  bordered: false,
};

export function Travel17({
  model,
  category,
  seats,
  transmission,
  fuel,
  pricePerDay,
  bordered = false,
  className,
}: Travel17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Car className="size-6 shrink-0 text-slate-600 dark:text-slate-300" aria-hidden="true" />
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
            <span className="shrink-0 text-sm font-bold tabular-nums text-card-foreground">
              {pricePerDay}
            </span>
          )}
        </div>
        {(seats !== undefined || transmission || fuel) && (
          <div className="grid grid-cols-3 gap-1 rounded-md bg-muted/60 p-2 text-xs text-muted-foreground">
            {seats !== undefined && (
              <span className="tabular-nums">{seats} seats</span>
            )}
            {transmission && <span>{transmission}</span>}
            {fuel && <span>{fuel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
