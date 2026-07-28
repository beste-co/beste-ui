"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "sunset";

interface Dashboard6Stage {
  label: string;
  value: number;
}

interface Dashboard6Props {
  stages?: Dashboard6Stage[];
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-500",
  sky: "bg-gradient-to-r from-sky-500 to-indigo-500",
  amber: "bg-gradient-to-r from-amber-500 to-orange-500",
  sunset: "bg-gradient-to-r from-rose-500 to-orange-500",
};

export const dashboard6Demo: Dashboard6Props = {
  stages: [
    { label: "Visit", value: 12400 },
    { label: "Sign-up", value: 3420 },
    { label: "Active", value: 1980 },
    { label: "Paid", value: 620 },
  ],
  tone: "primary",
};

export function Dashboard6({
  stages = [],
  tone = "violet",
  className,
}: Dashboard6Props) {
  const top = stages[0]?.value ?? 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        {stages.map((s, i) => {
          const pct = (s.value / top) * 100;
          const prev = stages[i - 1]?.value;
          const dropoff =
            typeof prev === "number"
              ? Math.round(((prev - s.value) / prev) * 100)
              : null;
          return (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium text-card-foreground">
                  {s.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono tabular-nums text-card-foreground">
                    {s.value.toLocaleString()}
                  </span>
                  {dropoff !== null && (
                    <span className="font-mono text-xs text-rose-600 dark:text-rose-400">
                      −{dropoff}%
                    </span>
                  )}
                </div>
              </div>
              <div className="flex h-2 w-full items-center overflow-hidden rounded-sm bg-muted">
                <span
                  className={cn("h-full", barClasses[tone])}
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
