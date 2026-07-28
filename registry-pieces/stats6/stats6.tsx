"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sunset" | "violet";

interface Stats6Props {
  value?: number;
  label?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sunset: "text-orange-500",
  violet: "text-violet-500",
};

export const stats6Demo: Stats6Props = {
  value: 84,
  label: "NPS",
  caption: "Promoters",
  tone: "emerald",
};

export function Stats6({
  value = 0,
  label,
  caption,
  tone = "primary",
  className,
}: Stats6Props) {
  const pct = Math.max(0, Math.min(100, value));
  const size = 72;
  const strokeWidth = 10;
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
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {pct}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold uppercase tracking-wide text-card-foreground">
              {label}
            </span>
          )}
          {caption && (
            <span className="text-xs text-muted-foreground">{caption}</span>
          )}
        </div>
      </div>
    </div>
  );
}
