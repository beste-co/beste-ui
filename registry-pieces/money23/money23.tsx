"use client";

import { ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareRow {
  label: string;
  amount: string;
  muted?: boolean;
}

interface Money23Props {
  label?: string;
  amount?: string;
  period?: string;
  delta?: string;
  rows?: CompareRow[];
  className?: string;
}

export const money23Demo: Money23Props = {
  label: "Estimated saving",
  amount: "$1,840",
  period: "per month",
  delta: "38% lower",
  rows: [
    { label: "Four tools today", amount: "$4,820", muted: true },
    { label: "One workspace", amount: "$2,980" },
  ],
};

export function Money23({ label, amount, period, delta, rows = [], className }: Money23Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        {label && <p className="text-sm text-muted-foreground">{label}</p>}

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          {amount && (
            <span className="text-3xl font-semibold tracking-tight tabular-nums text-card-foreground">
              {amount}
            </span>
          )}
          {period && <span className="text-sm text-muted-foreground">{period}</span>}
        </div>

        {delta && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <ArrowDownRight className="size-3" aria-hidden="true" />
            {delta}
          </span>
        )}

        {rows.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
            {rows.map((row, index) => (
              <div key={index} className="flex items-baseline justify-between gap-3">
                <span className="truncate text-sm text-muted-foreground">{row.label}</span>
                <span
                  className={cn(
                    "shrink-0 text-sm tabular-nums",
                    row.muted
                      ? "text-muted-foreground line-through"
                      : "font-medium text-card-foreground"
                  )}
                >
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
