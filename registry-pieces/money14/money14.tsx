"use client";

import { cn } from "@/lib/utils";

interface Money14Props {
  title?: string;
  incomeLabel?: string;
  income?: string;
  expensesLabel?: string;
  expenses?: string;
  netLabel?: string;
  net?: string;
  className?: string;
}

export const money14Demo: Money14Props = {
  title: "March",
  incomeLabel: "Income",
  income: "$8,420",
  expensesLabel: "Expenses",
  expenses: "$5,180",
  netLabel: "Net",
  net: "+$3,240",
};

export function Money14({
  title,
  incomeLabel = "Income",
  income = "$0",
  expensesLabel = "Expenses",
  expenses = "$0",
  netLabel = "Net",
  net = "$0",
  className,
}: Money14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
        {title && (
          <span className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </span>
        )}
        <div className="flex items-center justify-between py-1.5 text-sm">
          <span className="text-muted-foreground">{incomeLabel}</span>
          <span className="font-medium tabular-nums text-card-foreground">
            {income}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border py-1.5 text-sm">
          <span className="text-muted-foreground">{expensesLabel}</span>
          <span className="font-medium tabular-nums text-card-foreground">
            {expenses}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between border-t border-border pt-2.5">
          <span className="text-sm font-medium text-card-foreground">
            {netLabel}
          </span>
          <span className="text-xl font-bold tabular-nums text-foreground">
            {net}
          </span>
        </div>
      </div>
    </div>
  );
}
