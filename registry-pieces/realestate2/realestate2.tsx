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
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
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
  bordered: true,
  inverted: false,
  price: "$1,240,000",
  downPayment: "20% · $248,000",
  rate: "6.25% APR · 30-yr fixed",
  term: "30 years",
  monthly: "$6,108 / mo",
  tone: "emerald",
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
  tone = "emerald",
  eyebrowLabel = "Mortgage estimate",
  priceLabel = "Home price",
  downLabel = "Down",
  rateLabel = "Rate",
  termLabel = "Term",
  paymentLabel = "Est. payment",
  surface = "card",
  bordered = true,
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
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <PiggyBank className="size-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {eyebrowLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 rounded-md bg-current/10 p-2 text-xs">
          <div className="flex flex-col">
            <span className="text-current/60">{priceLabel}</span>
            <span className="font-mono font-semibold">
              {price}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-current/60">{downLabel}</span>
            <span className="font-mono font-semibold">
              {downPayment}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-current/60">{rateLabel}</span>
            <span className="font-mono">{rate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-current/60">{termLabel}</span>
            <span className="font-mono">{term}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-current/15 pt-2">
          <span className="text-sm text-current/60">{paymentLabel}</span>
          <span className="font-mono text-xl font-bold">
            {monthly}
          </span>
        </div>
      </div>
    </div>
  );
}
