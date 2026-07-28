"use client";

import { Dumbbell } from "lucide-react";
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

interface Week {
  week: number;
  focus: string;
  sessions: number;
  completed?: boolean;
  current?: boolean;
}

interface Fitness3Props {
  program?: string;
  weeks?: Week[];
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const currentClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

const currentPillClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const fitness3Demo: Fitness3Props = {
  program: "Hypertrophy 12 · Phase 2",
  weeks: [
    { week: 5, focus: "Volume peak", sessions: 5, completed: true },
    { week: 6, focus: "Deload", sessions: 3, completed: true },
    { week: 7, focus: "Strength push", sessions: 5, current: true },
    { week: 8, focus: "Strength test", sessions: 4 },
  ],
  tone: "neutral",
};

export function Fitness3({
  program,
  weeks = [],
  tone = "neutral",
  className,
}: Fitness3Props) {
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
              "flex size-7 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <Dumbbell className="size-3.5" aria-hidden="true" />
          </div>
          {program && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {program}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {weeks.map((w, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 py-1.5 text-sm"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold",
                  w.completed
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : w.current
                      ? currentClasses[tone]
                      : "bg-muted text-muted-foreground"
                )}
              >
                W{w.week}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium text-card-foreground">
                  {w.focus}
                </span>
                <span className="text-xs text-muted-foreground">
                  {w.sessions} sessions
                </span>
              </div>
              {w.current && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                    currentPillClasses[tone]
                  )}
                >
                  Current
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
