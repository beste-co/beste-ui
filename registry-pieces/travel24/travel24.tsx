"use client";

import { cn } from "@/lib/utils";

interface Day {
  date: string;
  high: number;
  low: number;
  icon: "sun" | "cloud" | "rain" | "partly";
}

interface Travel24Props {
  city?: string;
  days?: Day[];
  advisory?: string;
  bordered?: boolean;
  className?: string;
}

const iconChar: Record<Day["icon"], string> = {
  sun: "☀",
  cloud: "☁",
  rain: "☂",
  partly: "⛅",
};

export const travel24Demo: Travel24Props = {
  city: "Lisbon",
  days: [
    { date: "Fri 14", high: 27, low: 18, icon: "sun" },
    { date: "Sat 15", high: 26, low: 19, icon: "partly" },
    { date: "Sun 16", high: 23, low: 18, icon: "cloud" },
    { date: "Mon 17", high: 21, low: 17, icon: "rain" },
  ],
  bordered: false,
};

export function Travel24({
  city,
  days = [],
  advisory,
  bordered = false,
  className,
}: Travel24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {city && (
          <span className="text-xs font-semibold text-muted-foreground">
            {city}
          </span>
        )}
        <div className="flex items-end justify-between gap-1">
          {days.map((d, idx) => (
            <div
              key={idx}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-md bg-muted p-2 text-center"
            >
              <span className="text-xs text-muted-foreground">
                {d.date}
              </span>
              <span className="text-lg" aria-hidden="true">
                {iconChar[d.icon]}
              </span>
              <span className="text-sm font-semibold tabular-nums text-card-foreground">
                {d.high}°
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {d.low}°
              </span>
            </div>
          ))}
        </div>
        {advisory && (
          <span className="rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-300">
            {advisory}
          </span>
        )}
      </div>
    </div>
  );
}
