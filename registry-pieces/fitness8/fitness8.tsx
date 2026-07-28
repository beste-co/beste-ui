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

interface WarmUp {
  movement: string;
  duration: string;
}

interface Fitness8Props {
  heading?: string;
  items?: WarmUp[];
  totalTime?: string;
  tone?: Tone;
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

const pillClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const fitness8Demo: Fitness8Props = {
  heading: "Pre-lift warm-up",
  items: [
    { movement: "Rowing machine", duration: "3 min easy" },
    { movement: "World's greatest stretch", duration: "1 min each side" },
    { movement: "Bodyweight squats", duration: "12 reps" },
    { movement: "Band pull-aparts", duration: "15 reps × 2" },
  ],
  totalTime: "~ 8 minutes",
  tone: "neutral",
};

export function Fitness8({
  heading,
  items = [],
  totalTime,
  tone = "neutral",
  className,
}: Fitness8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame
              className={cn("size-3.5", iconClasses[tone])}
              aria-hidden="true"
            />
            {heading && (
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {heading}
              </span>
            )}
          </div>
          {totalTime && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                pillClasses[tone]
              )}
            >
              {totalTime}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 py-1.5 text-sm"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-bold text-card-foreground">
                {idx + 1}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {item.movement}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {item.duration}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
