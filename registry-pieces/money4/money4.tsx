"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Direction = "incoming" | "outgoing";

interface Money4Props {
  merchant?: string;
  category?: string;
  amount?: string;
  date?: string;
  direction?: Direction;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const money4Demo: Money4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Money4Props) {
  const isIncoming = direction === "incoming";
  const Icon = isIncoming ? ArrowDownLeft : ArrowUpRight;
  const iconBubble = isIncoming
    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
    : "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400";
  const amountColor = isIncoming
    ? "text-emerald-600 dark:text-emerald-400"
    : "";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            iconBubble
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold">
            {merchant}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-current/60">
            {category && <span className="truncate">{category}</span>}
            {category && date && (
              <span className="size-1 shrink-0 rounded-full bg-current/15" />
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
