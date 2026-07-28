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
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
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
  monthVisits: 18,
  weeklyGoal: 5,
  label: "Gym streak",
  tone: "neutral",
};

export function Fitness4({
  streak = 0,
  week = [],
  monthVisits = 0,
  weeklyGoal = 0,
  label = "Gym streak",
  tone = "neutral",
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
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-xl shadow-md",
              iconClasses[tone]
            )}
          >
            <Flame className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <span className="font-mono text-xl font-bold text-card-foreground">
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {thisWeek} of {weeklyGoal} this week
          </span>
          <span>{monthVisits} visits this month</span>
        </div>
      </div>
    </div>
  );
}
