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
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  neutral: "bg-muted text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const health27Demo: Health27Props = {
  metric: "Blood glucose · fasting",
  unit: "mg/dL",
  readings: [
    { time: "Mon", value: 96 },
    { time: "Tue", value: 104, tag: "post-pasta" },
    { time: "Wed", value: 92 },
    { time: "Thu", value: 88 },
    { time: "Fri", value: 102 },
  ],
  tone: "rose",
};

export function Health27({
  metric,
  unit,
  readings = [],
  tone = "rose",
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
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <Activity className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {metric && (
              <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {metric}
              </span>
            )}
          </div>
          {latest && (
            <span className="shrink-0 font-mono text-sm font-bold text-card-foreground">
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
              <span className="w-10 font-mono text-xs text-muted-foreground">
                {r.time}
              </span>
              <span className="font-mono text-card-foreground">{r.value}</span>
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
