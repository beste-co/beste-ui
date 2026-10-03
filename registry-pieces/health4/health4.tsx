"use client";

import { Footprints } from "lucide-react";
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

interface Health4Props {
  steps?: number;
  goal?: number;
  distance?: string;
  kcal?: string;
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

export const health4Demo: Health4Props = {
  steps: 8420,
  goal: 10000,
  label: "Steps",
  tone: "primary",
  bordered: false,
};

export function Health4({
  steps = 0,
  goal = 10000,
  distance,
  kcal,
  label = "Steps",
  tone = "primary",
  bordered = false,
  className,
}: Health4Props) {
  const pct = Math.max(
    0,
    Math.min(100, Math.round((steps / Math.max(1, goal)) * 100))
  );

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Footprints
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-muted-foreground">
            {label}
          </span>
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            of {goal.toLocaleString()}
          </span>
        </div>
        <span className="text-3xl font-bold tabular-nums text-card-foreground">
          {steps.toLocaleString()}
        </span>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        {(distance || kcal) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {distance && <span>{distance}</span>}
            {kcal && <span>{kcal}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
