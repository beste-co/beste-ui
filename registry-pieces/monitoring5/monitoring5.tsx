"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "emerald"
  | "sky"
  | "violet"
  | "amber"
  | "rose";

interface Monitoring5Props {
  label?: string;
  value?: number;
  unit?: string;
  tone?: Tone;
  className?: string;
}

const arcClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const monitoring5Demo: Monitoring5Props = {
  label: "Error budget",
  value: 82,
  unit: "%",
  tone: "rose",
};

export function Monitoring5({
  label = "SLO",
  value = 0,
  unit = "%",
  tone = "rose",
  className,
}: Monitoring5Props) {
  const safe = Math.min(100, Math.max(0, value));
  const radius = 36;
  const circumference = Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-52 flex-col items-center gap-1 rounded-lg border border-border bg-card px-4 pb-3 pt-3 shadow-sm">
        <svg
          viewBox="0 0 100 56"
          className={cn("h-14 w-full", arcClasses[tone])}
          aria-hidden="true"
        >
          <path
            d="M 14 50 A 36 36 0 0 1 86 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            opacity={0.15}
          />
          <path
            d="M 14 50 A 36 36 0 0 1 86 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="-mt-3 flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {safe}
            <span className="text-sm font-medium text-muted-foreground">
              {unit}
            </span>
          </span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
