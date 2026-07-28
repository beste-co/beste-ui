"use client";

import { cn } from "@/lib/utils";

interface Input7Props {
  currency?: string;
  amount?: string;
  unit?: string;
  className?: string;
}

export const input7Demo: Input7Props = {
  currency: "$",
  amount: "12,480.00",
  unit: "USD",
};

export function Input7({
  currency = "$",
  amount = "0.00",
  unit = "USD",
  className,
}: Input7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center rounded-md border border-border bg-card px-3 py-2 shadow-sm">
        <span className="mr-2 font-mono text-lg font-semibold text-muted-foreground">
          {currency}
        </span>
        <span className="flex-1 text-right font-mono text-lg font-semibold text-card-foreground">
          {amount}
        </span>
        <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}
