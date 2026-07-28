"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Money2Props {
  fromCurrency?: string;
  fromAmount?: string;
  toCurrency?: string;
  toAmount?: string;
  rate?: string;
  className?: string;
}

export const money2Demo: Money2Props = {
  fromCurrency: "USD",
  fromAmount: "1.00",
  toCurrency: "EUR",
  toAmount: "0.92",
  rate: "1 USD = 0.92 EUR",
};

export function Money2({
  fromCurrency = "USD",
  fromAmount = "1.00",
  toCurrency = "EUR",
  toAmount = "0.92",
  rate,
  className,
}: Money2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {fromCurrency}
            </span>
            <span className="text-xl font-bold tabular-nums text-card-foreground">
              {fromAmount}
            </span>
          </div>
          <ArrowRight
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col items-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {toCurrency}
            </span>
            <span className="text-xl font-bold tabular-nums text-card-foreground">
              {toAmount}
            </span>
          </div>
        </div>
        {rate && (
          <span className="border-t border-border pt-2 text-xs text-muted-foreground">
            {rate}
          </span>
        )}
      </div>
    </div>
  );
}
