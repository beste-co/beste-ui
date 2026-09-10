"use client";

import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-current/10 text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const fitness1Demo: Fitness1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Fitness1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
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
              <span className="text-sm font-semibold">
                {exercise}
              </span>
            )}
            {target && (
              <span className="text-xs mt-0.5 text-current/60">
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
              <span className="font-mono font-semibold text-current/60">
                #{s.set}
              </span>
              <span className="font-mono">
                {s.reps} {repsLabel}
              </span>
              <span className="font-mono">
                {s.weight}
              </span>
              <span
                className={cn(
                  "justify-self-end rounded-full px-2 py-0.5 text-xs font-semibold",
                  s.done
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-current/10 text-current/60"
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
