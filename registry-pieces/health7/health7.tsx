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
  stages: defaultStages,
  label: "Sleep",
  tone: "primary",
  bordered: false,
};

export function Health7({
  totalHours,
  score,
  stages = defaultStages,
  label = "Sleep",
  tone = "primary",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Moon
            className={cn("size-5 shrink-0 fill-current", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-muted-foreground">
              {label}
            </span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {totalHours}
            </span>
          </div>
          {score !== undefined && (
            <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
              Score {score}
            </span>
          )}
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
                  "text-xs font-medium",
                  stage.text
                )}
              >
                {stage.label}
              </span>
              <span className="tabular-nums text-card-foreground">
                {Math.floor(stage.minutes / 60)}h {stage.minutes % 60}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
