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
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  gold: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  violet:
    "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  emerald:
    "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
  ocean: "bg-gradient-to-br from-sky-500 to-indigo-600 text-white",
};

export const stats9Demo: Stats9Props = {
  rank: 12,
  total: 500,
  label: "Weekly leaderboard",
  percentile: "Top 3%",
  tone: "primary",
};

export function Stats9({
  rank = 1,
  total = 1,
  label,
  percentile,
  tone = "primary",
  className,
}: Stats9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full shadow-sm",
            toneClasses[tone]
          )}
          aria-hidden="true"
        >
          <Trophy className="size-5" aria-hidden="true" />
        </div>
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
