"use client";

import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber"
  | "sunset";

interface Travel16Props {
  program?: string;
  tier?: string;
  miles?: string;
  milesLabel?: string;
  milesToNext?: string;
  progress?: number;
  tone?: Tone;
  className?: string;
}

const cardClasses: Record<Tone, string> = {
  neutral: "border border-border bg-background text-foreground",
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  violet: "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white",
  sky: "bg-gradient-to-br from-sky-500 to-indigo-500 text-white",
  amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
  sunset: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white",
};

export const travel16Demo: Travel16Props = {
  program: "Miles & Smiles",
  tier: "Elite Gold",
  miles: "42,180",
  milesLabel: "miles",
  milesToNext: "7,820 miles to Elite Platinum",
  progress: 84,
  tone: "neutral",
};

export function Travel16({
  program,
  tier,
  miles,
  milesLabel,
  milesToNext,
  progress = 0,
  tone = "neutral",
  className,
}: Travel16Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm",
          cardClasses[tone]
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-current/10 backdrop-blur">
              <Plane className="size-4" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                {program}
              </span>
              <span className="text-sm font-bold">{tier}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-xl font-bold">{miles}</span>
            {milesLabel && (
              <span className="text-xs opacity-80">{milesLabel}</span>
            )}
          </div>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-current/20"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-current"
            style={{ width: `${pct}%` }}
          />
        </div>
        {milesToNext && (
          <span className="text-sm opacity-80">{milesToNext}</span>
        )}
      </div>
    </div>
  );
}
