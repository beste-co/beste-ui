"use client";

import { cn } from "@/lib/utils";

interface Card13Props {
  billing?: "monthly" | "yearly";
  monthlyPrice?: string;
  yearlyPrice?: string;
  savings?: string;
  bordered?: boolean;
  className?: string;
}

export const card13Demo: Card13Props = {
  billing: "yearly",
  monthlyPrice: "$19",
  yearlyPrice: "$15",
  savings: "Save 20%",
  bordered: false,
};

export function Card13({
  billing = "monthly",
  monthlyPrice = "$0",
  yearlyPrice = "$0",
  savings,
  bordered = false,
  className,
}: Card13Props) {
  const activePrice = billing === "yearly" ? yearlyPrice : monthlyPrice;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between rounded-full bg-muted p-1">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              billing === "monthly"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            className={cn(
              "flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
              billing === "yearly"
                ? "bg-card text-card-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <span>Yearly</span>
            {savings && (
              <span className="rounded bg-emerald-500/20 px-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {savings}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tabular-nums text-card-foreground">
            {activePrice}
          </span>
          <span className="text-sm text-muted-foreground">/ mo</span>
        </div>
        <button
          type="button"
          className="rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background hover:opacity-90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
