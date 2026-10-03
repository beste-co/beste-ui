"use client";

import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface Health26Props {
  phase?: "inhale" | "hold" | "exhale";
  secondsLeft?: number;
  cycle?: string;
  bordered?: boolean;
  className?: string;
}

const phaseConfig = {
  inhale: {
    label: "Inhale",
    scale: "scale-100",
    ring: "bg-sky-500/20",
  },
  hold: {
    label: "Hold",
    scale: "scale-110",
    ring: "bg-indigo-500/20",
  },
  exhale: {
    label: "Exhale",
    scale: "scale-75",
    ring: "bg-violet-500/20",
  },
};

export const health26Demo: Health26Props = {
  phase: "inhale",
  secondsLeft: 3,
  cycle: "Round 2 of 4",
  bordered: false,
};

export function Health26({
  phase = "inhale",
  secondsLeft = 0,
  cycle,
  bordered = false,
  className,
}: Health26Props) {
  const config = phaseConfig[phase];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col items-center gap-3 rounded-xl bg-card p-4 shadow-sm", bordered && "border border-border")}>
        <div className="relative flex size-24 items-center justify-center">
          <span
            className={cn(
              "absolute inset-0 rounded-full transition-transform duration-1000",
              config.ring,
              config.scale
            )}
            aria-hidden="true"
          />
          <div className="relative flex size-16 items-center justify-center rounded-full bg-card shadow-md">
            <Wind
              className="size-6 text-sky-500"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-bold text-card-foreground">
            {config.label}
          </span>
          <span className="text-3xl font-bold tabular-nums text-sky-500">
            {secondsLeft}
          </span>
          {cycle && (
            <span className="text-xs text-muted-foreground">{cycle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
