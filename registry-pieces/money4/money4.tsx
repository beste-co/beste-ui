"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "incoming" | "outgoing";

interface Money4Props {
  merchant?: string;
  category?: string;
  amount?: string;
  date?: string;
  direction?: Direction;
  className?: string;
}

export const money4Demo: Money4Props = {
  merchant: "Stripe payout",
  category: "Income",
  amount: "+$3,240.00",
  date: "Today · 09:14",
  direction: "incoming",
};

export function Money4({
  merchant = "Transaction",
  category,
  amount = "$0",
  date,
  direction = "outgoing",
  className,
}: Money4Props) {
  const isIncoming = direction === "incoming";
  const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight;
  const iconBubble = isIncoming
    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
    : "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400";
  const amountColor = isIncoming
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-card-foreground";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            iconBubble
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {merchant}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {category && <span className="truncate">{category}</span>}
            {category && date && (
              <span className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
            )}
            {date && <span className="truncate">{date}</span>}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 font-semibold tabular-nums",
            amountColor
          )}
        >
          {amount}
        </span>
      </div>
    </div>
  );
}
