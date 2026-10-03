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

interface Calendar30Props {
  date?: string;
  sunrise?: string;
  sunset?: string;
  daylightHours?: string;
  trend?: string;
  tone?: Tone;
  bordered?: boolean;
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
  tone: "neutral",
  bordered: false,
};

export function Calendar30({
  date,
  sunrise,
  sunset,
  daylightHours,
  trend,
  tone = "neutral",
  bordered = false,
  className,
}: Calendar30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {date && (
          <span className="text-xs font-semibold text-muted-foreground">
            {date}
          </span>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Sunrise</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {sunrise}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Daylight</span>
            <span
              className={cn("text-xl font-bold tabular-nums", accentClasses[tone])}
            >
              {daylightHours}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Sunset</span>
            <span className="text-lg font-bold tabular-nums text-card-foreground">
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
