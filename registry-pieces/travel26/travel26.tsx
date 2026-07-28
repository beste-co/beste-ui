"use client";

import { Banknote, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Travel26Props {
  from?: string;
  to?: string;
  amount?: string;
  result?: string;
  rate?: string;
  trend?: "up" | "down";
  trendAmount?: string;
  className?: string;
}

export const travel26Demo: Travel26Props = {
  from: "100 EUR",
  to: "USD",
  amount: "100",
  result: "108.42",
  rate: "1 EUR = 1.0842 USD",
  trend: "up",
  trendAmount: "+0.32% today",
};

export function Travel26({
  from,
  to,
  amount,
  result,
  rate,
  trend = "up",
  trendAmount,
  className,
}: Travel26Props) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
            <Banknote className="size-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            FX converter
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/60 p-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{from}</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {amount}
            </span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">{to}</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {result}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {rate && <span>{rate}</span>}
          {trendAmount && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold",
                trend === "up"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-rose-700 dark:text-rose-300"
              )}
            >
              <Icon className="size-3" aria-hidden="true" />
              {trendAmount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
