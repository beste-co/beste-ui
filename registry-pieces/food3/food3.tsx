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
  className?: string;
}

export const food3Demo: Food3Props = {
  restaurant: "Lokal · Modern Türk",
  when: "Thu, Apr 25 · 20:00",
  partySize: 4,
  table: "Patio · Table 12",
  confirmationCode: "LKL-7Z91",
  confirmedLabel: "Reservation confirmed",
  whenLabel: "When",
  guestsLabel: "Guests",
  seatingLabel: "Seating",
  codeLabel: "Code",
};

export function Food3({
  restaurant,
  when,
  partySize = 0,
  table,
  confirmationCode,
  confirmedLabel = "Reservation confirmed",
  whenLabel = "When",
  guestsLabel = "Guests",
  seatingLabel = "Seating",
  codeLabel = "Code",
  className,
}: Food3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
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
          <div className="flex flex-col">
            <span className="text-muted-foreground">{whenLabel}</span>
            <span className="font-semibold text-card-foreground">{when}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{guestsLabel}</span>
            <span className="font-semibold text-card-foreground">
              {partySize}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{seatingLabel}</span>
            <span className="truncate text-card-foreground">{table}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{codeLabel}</span>
            <span className="font-mono text-card-foreground">
              {confirmationCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
