"use client";

import { Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel26Props {
  from?: string;
  to?: string;
  amount?: string;
  result?: string;
  rate?: string;
  trend?: "up" | "down";
  trendAmount?: string;
  bordered?: boolean;
  className?: string;
}

export const travel26Demo: Travel26Props = {
  from: "EUR",
  to: "USD",
  amount: "100",
  result: "108.42",
  rate: "1 EUR = 1.0842 USD",
  bordered: false,
};

export function Travel26({
  from,
  to,
  amount,
  result,
  rate,
  trend = "up",
  trendAmount,
  bordered = false,
  className,
}: Travel26Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Banknote className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-muted-foreground">
            FX converter
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/60 p-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{from}</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {amount}
            </span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">{to}</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {result}
            </span>
          </div>
        </div>
        {(rate || trendAmount) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {rate && <span className="tabular-nums">{rate}</span>}
            {trendAmount && (
              <span
                className={cn(
                  "font-semibold tabular-nums",
                  trend === "up"
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-rose-700 dark:text-rose-300"
                )}
              >
                {trendAmount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
