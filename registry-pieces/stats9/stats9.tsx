"use client";

import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "gold"
  | "violet"
  | "emerald"
  | "ocean";

interface Stats9Props {
  rank?: number;
  total?: number;
  label?: string;
  percentile?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  gold: "text-amber-500",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  ocean: "text-sky-500",
};

export const stats9Demo: Stats9Props = {
  rank: 12,
  total: 500,
  label: "Weekly leaderboard",
  tone: "primary",
  bordered: false,
};

export function Stats9({
  rank = 1,
  total = 1,
  label,
  percentile,
  tone = "primary",
  bordered = false,
  className,
}: Stats9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <Trophy className={cn("size-6 shrink-0", iconClasses[tone])} aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tabular-nums leading-none text-card-foreground">
              #{rank}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              of {total.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {label && (
              <span className="truncate text-muted-foreground">{label}</span>
            )}
            {label && percentile && (
              <span
                className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                aria-hidden="true"
              />
            )}
            {percentile && (
              <span className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400">
                {percentile}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
