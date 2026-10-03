"use client";

import { Activity } from "lucide-react";
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

interface Reading {
  time: string;
  value: number;
  tag?: string;
}

interface Health27Props {
  metric?: string;
  unit?: string;
  readings?: Reading[];
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

export const health27Demo: Health27Props = {
  metric: "Fasting glucose",
  unit: "mg/dL",
  readings: [
    { time: "Mon", value: 96 },
    { time: "Tue", value: 104 },
    { time: "Wed", value: 92 },
    { time: "Thu", value: 88 },
  ],
  tone: "primary",
  bordered: false,
};

export function Health27({
  metric,
  unit,
  readings = [],
  tone = "primary",
  bordered = false,
  className,
}: Health27Props) {
  const latest = readings[readings.length - 1];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Activity
            className={cn("size-4 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            {metric && (
              <span className="truncate text-xs font-semibold text-muted-foreground">
                {metric}
              </span>
            )}
          </div>
          {latest && (
            <span className="shrink-0 text-sm font-bold tabular-nums text-card-foreground">
              {latest.value}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {unit}
              </span>
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {readings.map((r, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1 text-sm"
            >
              <span className="w-10 text-xs text-muted-foreground">
                {r.time}
              </span>
              <span className="tabular-nums text-card-foreground">{r.value}</span>
              {r.tag && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs italic text-muted-foreground">
                  {r.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
