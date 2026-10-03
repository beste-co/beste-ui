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

interface Fitness5Props {
  weight?: string;
  bodyFat?: string;
  muscle?: string;
  waterPct?: string;
  measuredAt?: string;
  label?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const labelClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-700 dark:text-sky-300",
  emerald: "text-emerald-700 dark:text-emerald-300",
  violet: "text-violet-700 dark:text-violet-300",
  amber: "text-amber-700 dark:text-amber-300",
  rose: "text-rose-700 dark:text-rose-300",
};

export const fitness5Demo: Fitness5Props = {
  weight: "74.2 kg",
  bodyFat: "16.8%",
  muscle: "38.6 kg",
  waterPct: "58.2%",
  label: "Body composition",
  tone: "primary",
  bordered: false,
};

export function Fitness5({
  weight,
  bodyFat,
  muscle,
  waterPct,
  measuredAt,
  label = "Body composition",
  tone = "primary",
  bordered = false,
  className,
}: Fitness5Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <span
          className={cn(
            "text-xs font-semibold",
            labelClasses[tone]
          )}
        >
          {label}
        </span>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-2">
            <span className="text-xs text-muted-foreground">Weight</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {weight}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-2">
            <span className="text-xs text-muted-foreground">Body fat</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {bodyFat}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-2">
            <span className="text-xs text-muted-foreground">Muscle mass</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {muscle}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted p-2">
            <span className="text-xs text-muted-foreground">Water</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {waterPct}
            </span>
          </div>
        </div>
        {measuredAt && (
          <span className="text-xs italic text-muted-foreground">
            {measuredAt}
          </span>
        )}
      </div>
    </div>
  );
}
