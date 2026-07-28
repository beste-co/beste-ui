"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald" | "amber";

interface Stats15Props {
  label?: string;
  percent?: number;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const ringStyles: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600",
  amber: "text-amber-500",
};

const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const stats15Demo: Stats15Props = {
  label: "Capacity used",
  percent: 78,
  caption: "of licensed seats",
};

export function Stats15({
  label = "Progress",
  percent = 0,
  caption,
  tone = "primary",
  className,
}: Stats15Props) {
  const clamped = Math.max(0, Math.min(percent, 100));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-4 rounded-md border border-border bg-card p-5 shadow-xl">
        <div className="relative size-16 shrink-0">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="3"
              className="stroke-muted"
            />
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={cn("stroke-current", ringStyles[tone])}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-card-foreground">
            {clamped}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium text-card-foreground">{label}</p>
          {caption && (
            <p className="truncate text-sm text-muted-foreground">{caption}</p>
          )}
        </div>
      </div>
    </div>
  );
}
