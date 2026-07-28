"use client";

import { Moon } from "lucide-react";
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

interface Fitness9Props {
  message?: string;
  readiness?: string;
  activities?: string[];
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-foreground text-background",
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

export const fitness9Demo: Fitness9Props = {
  message: "Recovery day",
  readiness: "72 readiness · take it easy",
  activities: [
    "20-min easy walk outside",
    "Mobility flow · 10 minutes",
    "Sauna + cold plunge (optional)",
    "Protein + carbs within 2 hours",
  ],
  tone: "violet",
};

export function Fitness9({
  message,
  readiness,
  activities = [],
  tone = "violet",
  className,
}: Fitness9Props) {
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
            <Moon className="size-4 fill-current" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            {message && (
              <span className="text-sm font-semibold text-card-foreground">
                {message}
              </span>
            )}
            {readiness && (
              <span className="text-xs italic text-muted-foreground">
                {readiness}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {activities.map((a, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span
                className={cn(
                  "mt-1.5 size-1.5 shrink-0 rounded-full",
                  bulletClasses[tone]
                )}
                aria-hidden="true"
              />
              <span className="text-card-foreground">{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
