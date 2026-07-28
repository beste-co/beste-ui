"use client";

import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Card19Props {
  credits?: string;
  price?: string;
  bonus?: string;
  perCredit?: string;
  creditsLabel?: string;
  action?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const buttonClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const card19Demo: Card19Props = {
  credits: "1,000",
  price: "$8.00",
  bonus: "+150 bonus credits",
  perCredit: "$0.008 per credit",
  creditsLabel: "credits",
  action: "Top up",
  tone: "neutral",
};

export function Card19({
  credits,
  price,
  bonus,
  perCredit,
  creditsLabel = "credits",
  action = "Top up",
  tone = "neutral",
  className,
}: Card19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Coins className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-2xl font-bold text-card-foreground">
              {credits}
            </span>
            <span className="text-xs text-muted-foreground">
              {creditsLabel}
            </span>
          </div>
        </div>
        {bonus && (
          <span className="self-start rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {bonus}
          </span>
        )}
        <div className="flex items-baseline justify-between border-t border-border pt-2">
          <span className="font-mono text-lg font-bold text-card-foreground">
            {price}
          </span>
          {perCredit && (
            <span className="text-xs text-muted-foreground">{perCredit}</span>
          )}
        </div>
        <button
          type="button"
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold hover:opacity-90",
            buttonClasses[tone]
          )}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
