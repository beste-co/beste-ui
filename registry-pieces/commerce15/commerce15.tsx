"use client";

import { Apple } from "lucide-react";
import { cn } from "@/lib/utils";

interface Commerce15Props {
  total?: string;
  bordered?: boolean;
  className?: string;
}

export const commerce15Demo: Commerce15Props = {
  total: "$284.00",
  bordered: false,
};

export function Commerce15({
  total = "$0.00",
  bordered = false,
  className,
}: Commerce15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            Express checkout
          </span>
          <span className="text-xs tabular-nums text-card-foreground">
            {total}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            className="flex h-9 items-center justify-center gap-1 rounded-sm bg-neutral-900 text-white transition-opacity hover:opacity-90 dark:bg-neutral-50 dark:text-neutral-900"
            aria-label="Pay with Apple Pay"
          >
            <Apple className="size-3.5 fill-current" aria-hidden="true" />
            <span className="text-xs font-semibold">Pay</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center justify-center gap-0.5 rounded-sm bg-neutral-900 text-white transition-opacity hover:opacity-90"
            aria-label="Pay with Google Pay"
          >
            <span className="text-xs font-semibold">
              <span className="text-sky-400">G</span>
              <span className="text-rose-400">o</span>
              <span className="text-amber-400">o</span>
              <span className="text-sky-400">g</span>
              <span className="text-emerald-400">l</span>
              <span className="text-rose-400">e</span>
            </span>
            <span className="text-xs font-semibold"> Pay</span>
          </button>
          <button
            type="button"
            className="flex h-9 items-center justify-center rounded-sm bg-yellow-300 text-indigo-900 transition-opacity hover:opacity-90"
            aria-label="Pay with PayPal"
          >
            <span className="text-xs font-bold italic">
              Pay<span className="text-sky-700">Pal</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
