"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Food3Props {
  restaurant?: string;
  when?: string;
  partySize?: number;
  table?: string;
  confirmationCode?: string;
  confirmedLabel?: string;
  whenLabel?: string;
  guestsLabel?: string;
  seatingLabel?: string;
  codeLabel?: string;
  bordered?: boolean;
  className?: string;
}

export const food3Demo: Food3Props = {
  restaurant: "Lokal",
  when: "Thu, Apr 25 · 20:00",
  partySize: 4,
  confirmedLabel: "Reservation confirmed",
  whenLabel: "When",
  guestsLabel: "Guests",
  bordered: false,
};

export function Food3({
  restaurant,
  when,
  partySize,
  table,
  confirmationCode,
  confirmedLabel = "Reservation confirmed",
  whenLabel = "When",
  guestsLabel = "Guests",
  seatingLabel = "Seating",
  codeLabel = "Code",
  bordered = false,
  className,
}: Food3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-emerald-500/5 p-3 shadow-sm", bordered && "border border-emerald-500/40")}>
        <div className="flex items-center gap-2">
          <Check className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {confirmedLabel}
            </span>
            {restaurant && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {restaurant}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-md bg-card p-2 text-xs">
          {when && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">{whenLabel}</span>
              <span className="font-semibold tabular-nums text-card-foreground">
                {when}
              </span>
            </div>
          )}
          {partySize !== undefined && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">{guestsLabel}</span>
              <span className="font-semibold tabular-nums text-card-foreground">
                {partySize}
              </span>
            </div>
          )}
          {table && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">{seatingLabel}</span>
              <span className="truncate text-card-foreground">{table}</span>
            </div>
          )}
          {confirmationCode && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">{codeLabel}</span>
              <span className="text-card-foreground">
                {confirmationCode}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
