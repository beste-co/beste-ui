"use client";

import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate2Props {
  price?: string;
  downPayment?: string;
  rate?: string;
  term?: string;
  monthly?: string;
  tone?: Tone;
  eyebrowLabel?: string;
  priceLabel?: string;
  downLabel?: string;
  rateLabel?: string;
  termLabel?: string;
  paymentLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-current",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};


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

export const realestate2Demo: Realestate2Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  price: "$1,240,000",
  downPayment: "20% · $248,000",
  monthly: "$6,108 / mo",
  tone: "primary",
  eyebrowLabel: "Mortgage estimate",
  priceLabel: "Home price",
  downLabel: "Down",
  rateLabel: "Rate",
  termLabel: "Term",
  paymentLabel: "Est. payment",
};

export function Realestate2({
  price,
  downPayment,
  rate,
  term,
  monthly,
  tone = "primary",
  eyebrowLabel = "Mortgage estimate",
  priceLabel = "Home price",
  downLabel = "Down",
  rateLabel = "Rate",
  termLabel = "Term",
  paymentLabel = "Est. payment",
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Realestate2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <PiggyBank
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-current/60">
            {eyebrowLabel}
          </span>
        </div>
        {(price || downPayment || rate || term) && (
          <div className="grid grid-cols-2 gap-1.5 rounded-md bg-current/10 p-2 text-xs">
            {price && (
              <div className="flex flex-col">
                <span className="text-current/60">{priceLabel}</span>
                <span className="font-semibold tabular-nums">{price}</span>
              </div>
            )}
            {downPayment && (
              <div className="flex flex-col">
                <span className="text-current/60">{downLabel}</span>
                <span className="font-semibold tabular-nums">{downPayment}</span>
              </div>
            )}
            {rate && (
              <div className="flex flex-col">
                <span className="text-current/60">{rateLabel}</span>
                <span>{rate}</span>
              </div>
            )}
            {term && (
              <div className="flex flex-col">
                <span className="text-current/60">{termLabel}</span>
                <span>{term}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-current/15 pt-2">
          <span className="text-sm text-current/60">{paymentLabel}</span>
          <span className="text-xl font-bold tabular-nums">
            {monthly}
          </span>
        </div>
      </div>
    </div>
  );
}
