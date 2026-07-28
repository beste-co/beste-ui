"use client";

import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "rose";

interface Commerce17Props {
  tier?: string;
  nextTier?: string;
  points?: number;
  nextThreshold?: number;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  amber: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  rose: "bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
  sky: "bg-gradient-to-r from-sky-500 to-indigo-500",
  amber: "bg-gradient-to-r from-amber-400 to-orange-500",
  rose: "bg-gradient-to-r from-rose-500 to-fuchsia-500",
};

export const commerce17Demo: Commerce17Props = {
  tier: "Gold",
  nextTier: "Platinum",
  points: 2140,
  nextThreshold: 2750,
  tone: "primary",
};

export function Commerce17({
  tier = "Silver",
  nextTier,
  points = 0,
  nextThreshold = 1000,
  tone = "primary",
  className,
}: Commerce17Props) {
  const pct = Math.max(2, Math.min(100, (points / nextThreshold) * 100));
  const remaining = Math.max(0, nextThreshold - points);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full shadow-sm",
                tileClasses[tone]
              )}
              aria-hidden="true"
            >
              <Crown className="size-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-card-foreground">
                {tier} member
              </span>
              <span className="text-xs text-muted-foreground">
                Loyalty program
              </span>
            </div>
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
            {points.toLocaleString()}
            <span className="ml-0.5 text-xs text-muted-foreground">pts</span>
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        {nextTier && (
          <span className="text-xs text-muted-foreground">
            {remaining.toLocaleString()} pts to{" "}
            <span className="font-medium text-card-foreground">{nextTier}</span>
          </span>
        )}
      </div>
    </div>
  );
}
