"use client";

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

interface Health29Props {
  cycleDay?: number;
  cycleLength?: number;
  phase?: string;
  nextPeriod?: string;
  moodNote?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const ringClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const noteClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-600 dark:text-sky-300",
  emerald: "text-emerald-600 dark:text-emerald-300",
  violet: "text-violet-600 dark:text-violet-300",
  amber: "text-amber-600 dark:text-amber-300",
  rose: "text-rose-600 dark:text-rose-300",
};

export const health29Demo: Health29Props = {
  cycleDay: 14,
  cycleLength: 28,
  phase: "Ovulation window",
  nextPeriod: "Period in ~14 days",
  moodNote: "Energy usually peaks today.",
  label: "Cycle",
  tone: "rose",
};

export function Health29({
  cycleDay = 0,
  cycleLength = 28,
  phase,
  nextPeriod,
  moodNote,
  label = "Cycle",
  tone = "rose",
  className,
}: Health29Props) {
  const circ = 2 * Math.PI * 32;
  const dash = (cycleDay / Math.max(1, cycleLength)) * circ;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative shrink-0">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className={cn("-rotate-90", ringClasses[tone])}
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              strokeWidth="6"
              className="stroke-muted"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={`${dash} ${circ}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg font-bold text-card-foreground">
              {cycleDay}
            </span>
            <span className="text-xs text-muted-foreground">
              / {cycleLength}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          </div>
          {phase && (
            <span className="text-sm font-semibold text-card-foreground">
              {phase}
            </span>
          )}
          {nextPeriod && (
            <span className="text-xs text-muted-foreground">{nextPeriod}</span>
          )}
          {moodNote && (
            <span className={cn("text-xs italic", noteClasses[tone])}>
              {moodNote}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
