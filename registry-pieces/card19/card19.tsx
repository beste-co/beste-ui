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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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
  creditsLabel: "credits",
  action: "Top up",
  tone: "neutral",
  bordered: false,
};

export function Card19({
  credits,
  price,
  bonus,
  perCredit,
  creditsLabel = "credits",
  action = "Top up",
  tone = "neutral",
  bordered = false,
  className,
}: Card19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 flex-col gap-2 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Coins
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold tabular-nums text-card-foreground">
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
          <span className="text-lg font-bold tabular-nums text-card-foreground">
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
