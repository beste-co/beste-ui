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
  bordered: false,
};

export function Health3({
  exercise,
  sets = 0,
  reps = 0,
  weight,
  restSeconds = 0,
  completed = 0,
  tone = "neutral",
  bordered = false,
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
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Dumbbell
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {exercise}
            </span>
            <span className="text-xs text-muted-foreground">
              {sets} × {reps}
              {weight ? ` · ${weight}` : ""}
            </span>
          </div>
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold tabular-nums text-card-foreground">
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
      </div>
    </div>
  );
}
