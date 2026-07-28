"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "success" | "warning";

interface Chart2Props {
  value?: number;
  label?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  success: "text-emerald-500",
  warning: "text-amber-500",
};

export const chart2Demo: Chart2Props = {
  value: 64,
  label: "Capacity",
  caption: "of target",
  tone: "success",
};

export function Chart2({
  value = 0,
  label,
  caption = "of target",
  tone = "primary",
  className,
}: Chart2Props) {
  const pct = Math.max(0, Math.min(100, value));
  const size = 96;
  const strokeWidth = 12;
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
      <div className="flex items-center gap-3">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={cn("-rotate-90", toneClasses[tone])}
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
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {pct}%
            </span>
          </div>
        </div>
        {label && (
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            {caption && (
              <span className="text-sm font-semibold text-card-foreground">
                {caption}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
