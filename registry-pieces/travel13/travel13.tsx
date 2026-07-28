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
  className?: string;
}

export const travel13Demo: Travel13Props = {
  confirmationNo: "AKSQ-24LP-7N",
  hotel: "Hotel Alma Soho · Barcelona",
  checkIn: "Jun 14",
  checkOut: "Jun 18",
  nights: 4,
  guests: "2 adults",
  total: "€736",
};

export function Travel13({
  confirmationNo,
  hotel,
  checkIn,
  checkOut,
  nights = 0,
  guests,
  total,
  className,
}: Travel13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-emerald-500 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Booking confirmed
            </span>
            {confirmationNo && (
              <span className="truncate font-mono text-xs text-muted-foreground">
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
            {nights} nights · {guests}
          </span>
          <span className="font-mono text-base font-bold text-card-foreground">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
