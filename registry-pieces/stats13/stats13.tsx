"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "emerald"
  | "violet"
  | "sky"
  | "amber"
  | "rose";

interface Stats13Props {
  value?: number;
  label?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  sky: "text-sky-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const stats13Demo: Stats13Props = {
  value: 83,
  label: "Positive",
  tone: "violet",
};

const RADIUS = 40;
const ARC_LENGTH = Math.PI * RADIUS;
const ARC_PATH = "M 10 50 A 40 40 0 0 1 90 50";

export function Stats13({
  value = 83,
  label = "Score",
  tone = "violet",
  className,
}: Stats13Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const filled = (clamped / 100) * ARC_LENGTH;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border border-border bg-card px-5 py-4 shadow-sm",
          toneClasses[tone]
        )}
      >
        <svg
          viewBox="0 0 100 56"
          className="w-28"
          aria-hidden="true"
        >
          <path
            d={ARC_PATH}
            className="stroke-border"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={ARC_PATH}
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${ARC_LENGTH}`}
          />
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${(clamped / 100) * 180 - 90} 50 50)`}
          />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          <circle cx="50" cy="50" r="1.25" className="fill-card" />
        </svg>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold leading-none tabular-nums">
            {clamped}
          </span>
          {label && (
            <span className="text-xs font-medium text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
