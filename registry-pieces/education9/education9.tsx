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
  className?: string;
}

export const education9Demo: Education9Props = {
  days: 14,
  caption: "Show up tomorrow to keep it alive.",
  week: ["done", "done", "done", "missed", "done", "today", "future"],
  tone: "orange",
};

const tileClasses: Record<Tone, string> = {
  neutral: "bg-muted text-card-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  orange: "bg-orange-500 text-white",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
  rose: "bg-rose-500 text-white",
  amber: "bg-amber-500 text-white",
};

const badgeTextClasses: Record<Tone, string> = {
  neutral: "text-card-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  orange: "text-orange-600",
  emerald: "text-emerald-600",
  sky: "text-sky-600",
  violet: "text-violet-600",
  rose: "text-rose-600",
  amber: "text-amber-600",
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
  tone = "orange",
  className,
}: Education9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center rounded-xl shadow-md",
            tileClasses[tone]
          )}
        >
          <Flame className="size-5" aria-hidden="true" />
          <span
            className={cn(
              "absolute -bottom-1 -right-1 rounded-full bg-card px-1 font-mono text-xs font-bold shadow-sm",
              badgeTextClasses[tone]
            )}
          >
            {days}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm font-semibold text-card-foreground">
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
