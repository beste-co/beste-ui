"use client";

import { Flame } from "lucide-react";
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
  caption?: string;
  week?: DayState[];
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

export const education9Demo: Education9Props = {
  days: 14,
  week: ["done", "done", "done", "missed", "done", "today", "future"],
  tone: "primary",
  bordered: false,
};

const iconClasses: Record<Tone, string> = {
  neutral: "text-card-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  orange: "text-orange-500",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  rose: "text-rose-500",
  amber: "text-amber-500",
};

const dotActiveClasses: Record<Tone, string> = {
  neutral: "bg-card-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  orange: "bg-orange-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  rose: "bg-rose-500",
  amber: "bg-amber-500",
};

const dotSize: Record<DayState, string> = {
  done: "size-2",
  missed: "size-2",
  today: "size-3",
  future: "size-2",
};

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function Education9({
  days = 0,
  caption,
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
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <Flame
          className={cn("size-6 shrink-0", iconClasses[tone])}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm font-semibold tabular-nums text-card-foreground">
            {days}-day streak
          </span>
          <div className="flex items-center gap-1" aria-hidden="true">
            {week.map((state, idx) => (
              <div
                key={idx}
                className="flex flex-1 flex-col items-center gap-0.5"
              >
                <span className="text-xs text-muted-foreground">
                  {dayLabels[idx]}
                </span>
                <span
                  className={cn(
                    "rounded-full",
                    dotSize[state],
                    state === "done" || state === "today"
                      ? dotActiveClasses[tone]
                      : state === "missed"
                        ? "bg-muted"
                        : "border border-dashed border-border bg-muted"
                  )}
                />
              </div>
            ))}
          </div>
          {caption && (
            <span className="text-xs text-muted-foreground">{caption}</span>
          )}
        </div>
      </div>
    </div>
  );
}
