"use client";

import { Goal } from "lucide-react";
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

interface Fitness6Props {
  goal?: string;
  target?: string;
  current?: string;
  percent?: number;
  deadline?: string;
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

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const deadlineClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

export const fitness6Demo: Fitness6Props = {
  goal: "Run a half marathon",
  current: "17.2 km longest run",
  percent: 82,
  tone: "neutral",
  bordered: false,
};

export function Fitness6({
  goal,
  target,
  current,
  percent = 0,
  deadline,
  tone = "neutral",
  bordered = false,
  className,
}: Fitness6Props) {
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Goal
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            {goal && (
              <span className="text-sm font-semibold text-card-foreground">
                {goal}
              </span>
            )}
            {target && (
              <span className="text-xs text-muted-foreground">{target}</span>
            )}
          </div>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        {(current || deadline) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {current && <span>{current}</span>}
            {deadline && (
              <span className={cn("font-semibold", deadlineClasses[tone])}>
                {deadline}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
