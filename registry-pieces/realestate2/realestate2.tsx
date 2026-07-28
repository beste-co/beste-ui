"use client";

import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const realestate2Demo: Realestate2Props = {
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
  className,
}: Realestate2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <PiggyBank className="size-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {eyebrowLabel}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 rounded-md bg-muted p-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">{priceLabel}</span>
            <span className="font-mono font-semibold text-card-foreground">
              {price}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{downLabel}</span>
            <span className="font-mono font-semibold text-card-foreground">
              {downPayment}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{rateLabel}</span>
            <span className="font-mono text-card-foreground">{rate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{termLabel}</span>
            <span className="font-mono text-card-foreground">{term}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-2">
          <span className="text-sm text-muted-foreground">{paymentLabel}</span>
          <span className="font-mono text-xl font-bold text-card-foreground">
            {monthly}
          </span>
        </div>
      </div>
    </div>
  );
}
