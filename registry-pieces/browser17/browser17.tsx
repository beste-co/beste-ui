"use client";

import { cn } from "@/lib/utils";

interface Browser17Props {
  score?: number;
  label?: string;
  className?: string;
}

export const browser17Demo: Browser17Props = {
  score: 92,
  label: "Performance",
};

function scoreTint(score: number) {
  if (score >= 90)
    return {
      stroke: "text-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      chip: "Excellent",
    };
  if (score >= 50)
    return {
      stroke: "text-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      chip: "Needs work",
    };
  return {
    stroke: "text-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    chip: "Poor",
  };
}

export function Browser17({
  score = 0,
  label,
  className,
}: Browser17Props) {
  const pct = Math.max(0, Math.min(100, score));
  const cfg = scoreTint(pct);
  const size = 72;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={cn("-rotate-90", cfg.stroke)}
            aria-hidden="true"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className="text-border"
              stroke="currentColor"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "text-xl font-bold tabular-nums",
                cfg.text
              )}
            >
              {pct}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
          <span className={cn("text-sm font-semibold", cfg.text)}>
            {cfg.chip}
          </span>
        </div>
      </div>
    </div>
  );
}
