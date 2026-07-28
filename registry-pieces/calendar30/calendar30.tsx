"use client";

import { Sun } from "lucide-react";
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

interface Calendar30Props {
  date?: string;
  sunrise?: string;
  sunset?: string;
  daylightHours?: string;
  trend?: string;
  tone?: Tone;
  className?: string;
}

const accentClasses: Record<Tone, string> = {
  neutral: "text-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const calendar30Demo: Calendar30Props = {
  date: "Thursday, Apr 23",
  sunrise: "06:18",
  sunset: "19:52",
  daylightHours: "13h 34m",
  trend: "+2 min vs yesterday",
  tone: "neutral",
};

export function Calendar30({
  date,
  sunrise,
  sunset,
  daylightHours,
  trend,
  tone = "neutral",
  className,
}: Calendar30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Sun
            className={cn("size-4", accentClasses[tone])}
            aria-hidden="true"
          />
          {date && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {date}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Sunrise</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {sunrise}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Daylight</span>
            <span
              className={cn("font-mono text-xl font-bold", accentClasses[tone])}
            >
              {daylightHours}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Sunset</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {sunset}
            </span>
          </div>
        </div>
        {trend && (
          <span className="text-sm text-emerald-700 dark:text-emerald-300">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
