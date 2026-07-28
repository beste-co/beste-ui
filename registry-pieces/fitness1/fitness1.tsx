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

interface ExerciseSet {
  set: number;
  reps: string;
  weight: string;
  done?: boolean;
}

interface Fitness1Props {
  exercise?: string;
  target?: string;
  sets?: ExerciseSet[];
  repsLabel?: string;
  doneLabel?: string;
  nextLabel?: string;
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

export const fitness1Demo: Fitness1Props = {
  exercise: "Back squat",
  target: "5 × 5 @ RPE 8",
  sets: [
    { set: 1, reps: "5", weight: "80 kg", done: true },
    { set: 2, reps: "5", weight: "85 kg", done: true },
    { set: 3, reps: "5", weight: "95 kg" },
    { set: 4, reps: "5", weight: "95 kg" },
  ],
  repsLabel: "reps",
  doneLabel: "Done",
  nextLabel: "Next",
  tone: "neutral",
};

export function Fitness1({
  exercise,
  target,
  sets = [],
  repsLabel = "reps",
  doneLabel = "Done",
  nextLabel = "Next",
  tone = "neutral",
  className,
}: Fitness1Props) {
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
            <Dumbbell className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-row gap-2 items-center">
            {exercise && (
              <span className="text-sm font-semibold text-card-foreground">
                {exercise}
              </span>
            )}
            {target && (
              <span className="text-xs mt-0.5 text-muted-foreground">
                {target}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {sets.map((s, idx) => (
            <div
              key={idx}
              className={cn(
                "grid grid-cols-4 items-center gap-2 py-1.5 text-sm",
                s.done && "opacity-60"
              )}
            >
              <span className="font-mono font-semibold text-muted-foreground">
                #{s.set}
              </span>
              <span className="font-mono text-card-foreground">
                {s.reps} {repsLabel}
              </span>
              <span className="font-mono text-card-foreground">
                {s.weight}
              </span>
              <span
                className={cn(
                  "justify-self-end rounded-full px-2 py-0.5 text-xs font-semibold",
                  s.done
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {s.done ? doneLabel : nextLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
