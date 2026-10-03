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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
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
  bordered: false,
};

export function Commerce17({
  tier = "Silver",
  nextTier,
  points = 0,
  nextThreshold = 1000,
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Crown
              className={cn("size-4 shrink-0", iconClasses[tone])}
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-card-foreground">
              {tier} member
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums text-card-foreground">
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
