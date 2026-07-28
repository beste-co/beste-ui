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

interface Health3Props {
  exercise?: string;
  sets?: number;
  reps?: number;
  weight?: string;
  restSeconds?: number;
  completed?: number;
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

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const health3Demo: Health3Props = {
  exercise: "Back squat",
  sets: 5,
  reps: 5,
  weight: "80 kg",
  restSeconds: 90,
  completed: 3,
  tone: "neutral",
};

export function Health3({
  exercise,
  sets = 0,
  reps = 0,
  weight,
  restSeconds = 0,
  completed = 0,
  tone = "neutral",
  className,
}: Health3Props) {
  const mm = Math.floor(restSeconds / 60);
  const ss = (restSeconds % 60).toString().padStart(2, "0");

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
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {exercise}
            </span>
            <span className="text-xs text-muted-foreground">
              {sets} × {reps} · {weight}
            </span>
          </div>
          <span className="rounded-full bg-muted px-2 py-1 font-mono text-xs font-semibold text-card-foreground">
            {mm}:{ss}
          </span>
        </div>
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: sets }).map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                idx < completed ? barClasses[tone] : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Set {completed + 1} of {sets} · Keep going
        </span>
      </div>
    </div>
  );
}
