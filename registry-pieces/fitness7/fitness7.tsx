"use client";

import { PlayCircle } from "lucide-react";
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

interface Fitness7Props {
  exercise?: string;
  muscleGroup?: string;
  cues?: string[];
  avoid?: string;
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

const bulletClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const fitness7Demo: Fitness7Props = {
  exercise: "Romanian deadlift",
  cues: [
    "Brace core before each rep",
    "Hinge at the hips, knees soft",
    "Keep the bar close to the shins",
  ],
  avoid: "Rounded lower back at the bottom",
  tone: "primary",
  bordered: false,
};

export function Fitness7({
  exercise,
  muscleGroup,
  cues = [],
  avoid,
  tone = "primary",
  bordered = false,
  className,
}: Fitness7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <PlayCircle
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex flex-col">
            {exercise && (
              <span className="text-sm font-semibold text-card-foreground">
                {exercise}
              </span>
            )}
            {muscleGroup && (
              <span className="text-xs text-muted-foreground">
                {muscleGroup}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {cues.map((cue, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  bulletClasses[tone]
                )}
                aria-hidden="true"
              />
              <span className="text-card-foreground">{cue}</span>
            </div>
          ))}
        </div>
        {avoid && (
          <div className="rounded-md bg-rose-500/10 p-2 text-sm text-rose-700 dark:text-rose-300">
            Avoid · {avoid}
          </div>
        )}
      </div>
    </div>
  );
}
