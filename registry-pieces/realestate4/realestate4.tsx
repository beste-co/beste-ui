"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate4Props {
  neighborhood?: string;
  medianPrice?: string;
  trend?: string;
  daysOnMarket?: string;
  listings?: string;
  tone?: Tone;
  className?: string;
}

const pillClasses: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const realestate4Demo: Realestate4Props = {
  neighborhood: "Levent · Istanbul",
  medianPrice: "$1.08M median",
  trend: "+4.2% YoY",
  daysOnMarket: "18 avg days on market",
  listings: "142 active listings",
  tone: "primary",
};

export function Realestate4({
  neighborhood,
  medianPrice,
  trend,
  daysOnMarket,
  listings,
  tone = "primary",
  className,
}: Realestate4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          {neighborhood && (
            <span className="text-sm font-semibold text-card-foreground">
              {neighborhood}
            </span>
          )}
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                pillClasses[tone]
              )}
            >
              <TrendingUp className="size-3" aria-hidden="true" />
              {trend}
            </span>
          )}
        </div>
        {medianPrice && (
          <span className="font-mono text-xl font-bold text-card-foreground">
            {medianPrice}
          </span>
        )}
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          {daysOnMarket && <span>{daysOnMarket}</span>}
          {listings && <span>{listings}</span>}
        </div>
      </div>
    </div>
  );
}
