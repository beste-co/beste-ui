"use client";

import { Flame } from "lucide-react";
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

interface Fitness4Props {
  streak?: number;
  week?: boolean[];
  monthVisits?: number;
  weeklyGoal?: number;
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

const dotClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export const fitness4Demo: Fitness4Props = {
  streak: 14,
  week: [true, true, true, false, true, true, false],
  label: "Gym streak",
  tone: "neutral",
  bordered: false,
};

export function Fitness4({
  streak = 0,
  week = [],
  monthVisits,
  weeklyGoal,
  label = "Gym streak",
  tone = "neutral",
  bordered = false,
  className,
}: Fitness4Props) {
  const thisWeek = week.filter(Boolean).length;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Flame
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">
              {label}
            </span>
            <span className="text-xl font-bold tabular-nums text-card-foreground">
              {streak} days
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1" aria-hidden="true">
          {week.map((v, idx) => (
            <div
              key={idx}
              className="flex flex-1 flex-col items-center gap-0.5"
            >
              <span className="text-xs text-muted-foreground">
                {dayLabels[idx]}
              </span>
              <span
                className={cn(
                  "size-6 rounded-md",
                  v
                    ? dotClasses[tone]
                    : "border border-dashed border-border bg-muted"
                )}
              />
            </div>
          ))}
        </div>
        {(weeklyGoal !== undefined || monthVisits !== undefined) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {weeklyGoal !== undefined && (
              <span>
                {thisWeek} of {weeklyGoal} this week
              </span>
            )}
            {monthVisits !== undefined && (
              <span>{monthVisits} visits this month</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
