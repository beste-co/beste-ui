"use client";

import { cn } from "@/lib/utils";

interface Money12Props {
  label?: string;
  amount?: string;
  delta?: string;
  period?: string;
  bordered?: boolean;
  className?: string;
}

export const money12Demo: Money12Props = {
  label: "Net worth",
  amount: "$248,910",
  delta: "+4.2%",
  period: "this quarter",
  bordered: false,
};

export function Money12({
  label,
  amount = "$0",
  delta,
  period,
  bordered = false,
  className,
}: Money12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-3 rounded-lg bg-card px-4 py-4 shadow-sm", bordered && "border border-border")}>
        {label && (
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
          {amount}
        </span>
        {(delta || period) && (
          <div className="flex items-baseline gap-2">
            {delta && (
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {delta}
              </span>
            )}
            {period && (
              <span className="text-sm text-muted-foreground">{period}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
