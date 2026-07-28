"use client";

import { Moon } from "lucide-react";
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

interface SleepStage {
  label: string;
  minutes: number;
  class: string;
  text: string;
}

interface Health7Props {
  totalHours?: string;
  score?: number;
  stages?: SleepStage[];
  label?: string;
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

const defaultStages: SleepStage[] = [
  { label: "Awake", minutes: 18, class: "bg-rose-400", text: "text-rose-500" },
  { label: "Light", minutes: 240, class: "bg-sky-400", text: "text-sky-500" },
  {
    label: "Deep",
    minutes: 95,
    class: "bg-indigo-500",
    text: "text-indigo-500",
  },
  {
    label: "REM",
    minutes: 108,
    class: "bg-violet-500",
    text: "text-violet-500",
  },
];

export const health7Demo: Health7Props = {
  totalHours: "7h 41m",
  score: 86,
  stages: defaultStages,
  label: "Sleep",
  tone: "violet",
};

export function Health7({
  totalHours,
  score = 0,
  stages = defaultStages,
  label = "Sleep",
  tone = "violet",
  className,
}: Health7Props) {
  const total = stages.reduce((acc, s) => acc + s.minutes, 0);

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
              "flex size-8 items-center justify-center rounded-full",
              iconClasses[tone]
            )}
          >
            <Moon className="size-4 fill-current" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {totalHours}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Score {score}
          </span>
        </div>
        <div
          className="flex h-2 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          {stages.map((stage, idx) => (
            <span
              key={idx}
              className={stage.class}
              style={{ width: `${(stage.minutes / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex flex-col">
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  stage.text
                )}
              >
                {stage.label}
              </span>
              <span className="font-mono text-card-foreground">
                {Math.floor(stage.minutes / 60)}h {stage.minutes % 60}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
