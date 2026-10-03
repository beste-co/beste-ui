"use client";

import { PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "rose" | "emerald" | "violet" | "sunset";

interface Money11Props {
  saved?: string;
  goal?: string;
  progress?: number;
  label?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  rose: "text-rose-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  sunset: "text-amber-500",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  rose: "bg-gradient-to-r from-rose-400 to-pink-500",
  emerald: "bg-gradient-to-r from-emerald-400 to-teal-500",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  sunset: "bg-gradient-to-r from-amber-400 to-orange-500",
};

export const money11Demo: Money11Props = {
  saved: "$2,480",
  goal: "$5,000",
  progress: 50,
  label: "Vacation fund",
  tone: "primary",
  bordered: false,
};

export function Money11({
  saved = "$0",
  goal = "$0",
  progress = 0,
  label,
  tone = "primary",
  bordered = false,
  className,
}: Money11Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <PiggyBank className={cn("size-7 shrink-0", iconClasses[tone])} aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {label && (
            <span className="truncate text-xs font-semibold text-muted-foreground">
              {label}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {saved}
            </span>
            <span className="text-xs text-muted-foreground">
              of {goal}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", barClasses[tone])}
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
