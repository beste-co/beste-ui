"use client";

import { Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Money8Props {
  amount?: string;
  currency?: string;
  label?: string;
  className?: string;
}

export const money8Demo: Money8Props = {
  amount: "200",
  currency: "USD",
  label: "Withdrawn",
};

export function Money8({
  amount = "0",
  currency = "USD",
  label = "Withdrawn",
  className,
}: Money8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-3 rounded-lg border-2 border-dashed border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <Banknote className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums text-card-foreground">
              {amount}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">
              {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
