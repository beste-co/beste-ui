"use client";

import { AlertCircle, PlayCircle } from "lucide-react";
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
  muscleGroup: "Hamstrings · Glutes · Back",
  cues: [
    "Brace core before each rep",
    "Hinge at the hips, knees soft",
    "Keep the bar close to the shins",
  ],
  avoid: "Rounded lower back at the bottom",
  tone: "sky",
};

export function Fitness7({
  exercise,
  muscleGroup,
  cues = [],
  avoid,
  tone = "sky",
  className,
}: Fitness7Props) {
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
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <PlayCircle className="size-4" aria-hidden="true" />
          </div>
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
          <div className="flex items-start gap-2 rounded-md bg-rose-500/10 p-2 text-sm">
            <AlertCircle
              className="mt-0.5 size-3.5 shrink-0 text-rose-500"
              aria-hidden="true"
            />
            <span className="text-rose-700 dark:text-rose-300">
              Avoid · {avoid}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
