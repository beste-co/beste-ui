"use client";

import { cn } from "@/lib/utils";

interface Input7Props {
  currency?: string;
  amount?: string;
  unit?: string;
  bordered?: boolean;
  className?: string;
}

export const input7Demo: Input7Props = {
  currency: "$",
  amount: "12,480.00",
  bordered: false,
};

export function Input7({
  currency = "$",
  amount = "0.00",
  unit,
  bordered = false,
  className,
}: Input7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <span className="mr-2 text-lg font-semibold text-muted-foreground">
          {currency}
        </span>
        <span className="flex-1 text-right text-lg font-semibold tabular-nums text-card-foreground">
          {amount}
        </span>
        {unit && (
          <span className="ml-2 text-xs font-semibold text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
