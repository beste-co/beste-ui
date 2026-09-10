"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Money2Props {
  fromCurrency?: string;
  fromAmount?: string;
  toCurrency?: string;
  toAmount?: string;
  rate?: string;
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

export const money2Demo: Money2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  fromCurrency: "USD",
  fromAmount: "1.00",
  toCurrency: "EUR",
  toAmount: "0.92",
  rate: "1 USD = 0.92 EUR",
};

export function Money2({
  fromCurrency = "USD",
  fromAmount = "1.00",
  toCurrency = "EUR",
  toAmount = "0.92",
  rate,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Money2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-2 rounded-lg px-3 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-current/60">
              {fromCurrency}
            </span>
            <span className="text-xl font-bold tabular-nums">
              {fromAmount}
            </span>
          </div>
          <ArrowRight
            className="size-4 shrink-0 text-current/60"
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col items-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-current/60">
              {toCurrency}
            </span>
            <span className="text-xl font-bold tabular-nums">
              {toAmount}
            </span>
          </div>
        </div>
        {rate && (
          <span className="border-t border-current/15 pt-2 text-xs text-current/60">
            {rate}
          </span>
        )}
      </div>
    </div>
  );
}
