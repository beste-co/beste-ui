"use client";

import { Trophy } from "lucide-react";
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

interface Fitness2Props {
  lift?: string;
  newPr?: string;
  previous?: string;
  prevLabel?: string;
  delta?: string;
  date?: string;
  label?: string;
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

const labelClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

const borderClasses: Record<Tone, string> = {
  neutral: "border-border",
  primary: "border-primary",
  foreground: "border-foreground",
  sky: "border-sky-500",
  emerald: "border-emerald-500",
  violet: "border-violet-500",
  amber: "border-amber-500",
  rose: "border-rose-500",
};

export const fitness2Demo: Fitness2Props = {
  lift: "Deadlift · 1RM",
  newPr: "180 kg",
  delta: "+10 kg",
  label: "New PR",
  tone: "primary",
  bordered: false,
};

export function Fitness2({
  lift,
  newPr,
  previous,
  prevLabel = "Prev",
  delta,
  date,
  label = "New PR",
  tone = "primary",
  bordered = false,
  className,
}: Fitness2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm",
          bordered && "border",
          borderClasses[tone]
        )}
      >
        <div className="flex items-center gap-2">
          <Trophy
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span
              className={cn(
                "text-xs font-semibold",
                labelClasses[tone]
              )}
            >
              {label}
            </span>
            {lift && (
              <span className="text-sm font-semibold text-card-foreground">
                {lift}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold tabular-nums text-card-foreground">
            {newPr}
          </span>
          {delta && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {delta}
            </span>
          )}
        </div>
        {(previous || date) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {previous && (
              <span>
                {prevLabel} {previous}
              </span>
            )}
            {date && <span>{date}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
