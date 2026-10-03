"use client";

import { cn } from "@/lib/utils";

interface Money17Props {
  plan?: string;
  amount?: string;
  period?: string;
  nextLabel?: string;
  nextDate?: string;
  bordered?: boolean;
  className?: string;
}

export const money17Demo: Money17Props = {
  plan: "Pro plan",
  amount: "$24",
  period: "/mo",
  nextLabel: "Next charge",
  nextDate: "Jul 1, 2026",
  bordered: false,
};

export function Money17({
  plan,
  amount = "$0",
  period,
  nextLabel = "Next charge",
  nextDate,
  bordered = false,
  className,
}: Money17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-3 rounded-lg bg-card px-4 py-3.5 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-baseline justify-between gap-2">
          {plan && (
            <span className="text-sm font-semibold text-card-foreground">
              {plan}
            </span>
          )}
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {amount}
            </span>
            {period && (
              <span className="text-sm text-muted-foreground">{period}</span>
            )}
          </div>
        </div>
        {nextDate && (
          <div className="flex items-center justify-between border-t border-border pt-2.5 text-sm">
            <span className="text-muted-foreground">{nextLabel}</span>
            <span className="font-medium tabular-nums text-card-foreground">
              {nextDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
