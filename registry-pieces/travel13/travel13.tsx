"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel13Props {
  confirmationNo?: string;
  hotel?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  guests?: string;
  total?: string;
  bordered?: boolean;
  className?: string;
}

export const travel13Demo: Travel13Props = {
  hotel: "Hotel Alma Soho · Barcelona",
  checkIn: "Jun 14",
  checkOut: "Jun 18",
  nights: 4,
  total: "€736",
  bordered: false,
};

export function Travel13({
  confirmationNo,
  hotel,
  checkIn,
  checkOut,
  nights = 0,
  guests,
  total,
  bordered = false,
  className,
}: Travel13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-emerald-500")}>
        <div className="flex items-center gap-2">
          <Check className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Booking confirmed
            </span>
            {confirmationNo && (
              <span className="truncate text-xs text-muted-foreground">
                {confirmationNo}
              </span>
            )}
          </div>
        </div>
        {hotel && (
          <span className="truncate text-sm font-semibold text-card-foreground">
            {hotel}
          </span>
        )}
        <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-semibold text-card-foreground">
              {checkIn}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-semibold text-card-foreground">
              {checkOut}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-sm text-muted-foreground">
          <span>
            {nights} nights
            {guests ? ` · ${guests}` : ""}
          </span>
          <span className="text-base font-bold tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
