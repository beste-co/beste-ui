"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "amber" | "violet";

interface Badge5Props {
  title?: string;
  caption?: string;
  points?: number;
  progress?: number;
  nextLabel?: string;
  countMs?: number;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  violet: "bg-violet-500",
};

export const badge5Demo: Badge5Props = {
  title: "Level 7 unlocked",
  caption: "Longest review streak on the team",
  points: 250,
  progress: 62,
  nextLabel: "Level 8 at 400 points",
  tone: "primary",
};

export function Badge5({
  title = "Achievement unlocked",
  caption,
  points = 0,
  progress = 0,
  nextLabel,
  countMs = 1200,
  tone = "primary",
  className,
}: Badge5Props) {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const steps = 24;
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      setRatio(step / steps);
      if (step >= steps) clearInterval(id);
    }, countMs / steps);
    return () => clearInterval(id);
  }, [countMs]);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`
@keyframes badge5-pop { 0% { opacity: 0; transform: scale(0.86); } 60% { transform: scale(1.04); } 100% { opacity: 1; transform: scale(1); } }
@keyframes badge5-in { from { opacity: 0; transform: translateY(0.5rem); } to { opacity: 1; transform: none; } }
`}</style>

      <div className="flex w-full max-w-64 flex-col items-center gap-3 text-center">
        <div style={{ animation: "badge5-in 500ms ease-out both" }}>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {caption && (
            <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>
          )}
        </div>

        <p
          className="text-3xl font-semibold tabular-nums text-foreground"
          style={{ animation: "badge5-pop 600ms ease-out" }}
        >
          +{Math.round(points * ratio).toLocaleString("en-US")}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            points
          </span>
        </p>

        <div className="w-full">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <span
              className={cn(
                "block h-full rounded-full transition-all duration-700 ease-out motion-reduce:transition-none",
                barClasses[tone]
              )}
              style={{ width: `${Math.min(100, progress * ratio)}%` }}
              aria-hidden="true"
            />
          </div>
          {nextLabel && (
            <p className="mt-1.5 text-xs text-muted-foreground">{nextLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}
