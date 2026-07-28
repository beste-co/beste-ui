"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "success" | "muted";

interface Progress2Props {
  value?: number;
  tone?: Tone;
  size?: number;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  success: "text-emerald-500",
  muted: "text-muted-foreground",
};

export const progress2Demo: Progress2Props = {
  value: 72,
  tone: "primary",
};

export function Progress2({
  value = 0,
  tone = "primary",
  size = 72,
  className,
}: Progress2Props) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
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
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold tabular-nums text-card-foreground">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
