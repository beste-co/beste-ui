"use client";

import { cn } from "@/lib/utils";

interface Money9Props {
  category?: string;
  spent?: string;
  budget?: string;
  progress?: number;
  className?: string;
}

export const money9Demo: Money9Props = {
  category: "Groceries",
  spent: "$284",
  budget: "$450",
  progress: 63,
};

export function Money9({
  category = "Category",
  spent = "$0",
  budget = "$0",
  progress = 0,
  className,
}: Money9Props) {
  const pct = Math.max(0, Math.min(100, progress));
  const fillClass =
    pct >= 90
      ? "bg-rose-500"
      : pct >= 70
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-card-foreground">
            {category}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            <span className="font-semibold text-card-foreground">{spent}</span>
            {" / "}
            {budget}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", fillClass)}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
