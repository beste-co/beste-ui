"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "orange"
  | "emerald"
  | "sky"
  | "violet"
  | "rose"
  | "amber";

type DayState = "done" | "missed" | "today" | "future";

interface Education9Props {
  days?: number;
  /** Words after the day count. */
  label?: string;
  week?: DayState[];
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

export const education9Demo: Education9Props = {
  days: 14,
  label: "day streak",
  week: ["done", "done", "done", "missed", "done", "today", "future"],
  tone: "primary",
  bordered: false,
};

const doneClasses: Record<Tone, string> = {
  neutral: "bg-card-foreground text-card",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  orange: "bg-orange-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
  rose: "bg-rose-500 text-white",
  amber: "bg-amber-500 text-white",
};

// Today is still open: an outline in the tone instead of a fill
const todayClasses: Record<Tone, string> = {
  neutral: "border-card-foreground text-card-foreground",
  primary: "border-primary text-primary",
  foreground: "border-foreground text-foreground",
  orange: "border-orange-500 text-orange-500",
  emerald: "border-emerald-500 text-emerald-500",
  sky: "border-sky-500 text-sky-500",
  violet: "border-violet-500 text-violet-500",
  rose: "border-rose-500 text-rose-500",
  amber: "border-amber-500 text-amber-500",
};

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function Education9({
  days = 0,
  label = "day streak",
  week = [],
  tone = "primary",
  bordered = false,
  className,
}: Education9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-5 rounded-xl bg-card p-5 shadow-sm", bordered && "border border-border")}>
        <div className="flex flex-col">
          <span className="text-4xl font-semibold leading-none tracking-tight tabular-nums text-card-foreground">{days}</span>
          <span className="mt-1.5 text-sm text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {week.map((state, idx) => (
            <span
              key={idx}
              className={cn(
                "flex aspect-square flex-1 items-center justify-center rounded-full text-sm font-medium",
                state === "done" && doneClasses[tone],
                state === "today" && cn("border-2", todayClasses[tone]),
                state === "missed" && "bg-muted text-muted-foreground",
                state === "future" && "text-muted-foreground"
              )}
            >
              {dayLabels[idx]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
