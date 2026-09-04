"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Progress17Props {
  value?: number;
  label?: string;
  caption?: string;
  durationMs?: number;
  tone?: Tone;
  className?: string;
}

const ringClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

const SIZE = 96;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const progress17Demo: Progress17Props = {
  value: 82,
  label: "Storage used",
  caption: "82 GB of 100 GB, upgrade before Friday",
  tone: "emerald",
};

export function Progress17({
  value = 0,
  label = "Progress",
  caption,
  durationMs = 1200,
  tone = "emerald",
  className,
}: Progress17Props) {
  const target = Math.max(0, Math.min(100, value));
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame((now) => {
      setMounted(true);
      step(now);
    });
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);

  const shown = Math.round(target * progress);
  const offset = CIRCUMFERENCE * (1 - (mounted ? target : 0) / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <span className="text-sm text-muted-foreground">{label}</span>

        <div className="relative size-24">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="size-full -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-muted"
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={cn(
                "transition-all ease-out motion-reduce:transition-none",
                ringClasses[tone]
              )}
              style={{ transitionDuration: `${durationMs}ms` }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums text-card-foreground">
            {shown}
            <span className="ml-0.5 text-sm font-normal text-muted-foreground">%</span>
          </span>
        </div>

        {caption && (
          <span className="text-center text-xs text-muted-foreground">{caption}</span>
        )}
      </div>
    </div>
  );
}
