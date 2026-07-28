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

interface Monitoring17Props {
  label?: string;
  tone?: Tone;
  className?: string;
}

const colorClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const wavePath =
  "M 0 15 L 18 15 L 22 15 L 26 6 L 30 24 L 34 9 L 38 15 L 60 15 L 64 15 L 68 5 L 72 25 L 76 10 L 80 15 L 100 15 L 104 15 L 108 7 L 112 23 L 116 11 L 120 15 L 144 15";

export const monitoring17Demo: Monitoring17Props = {
  label: "live",
  tone: "rose",
};

export function Monitoring17({
  label,
  tone = "rose",
  className,
}: Monitoring17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-56 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-sm",
          colorClasses[tone]
        )}
      >
        <svg
          viewBox="0 0 144 30"
          preserveAspectRatio="none"
          className="h-6 flex-1"
          aria-hidden="true"
        >
          <path
            d={wavePath}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="relative flex size-2 items-center justify-center">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60"
            aria-hidden="true"
          />
          <span
            className="relative size-2 rounded-full bg-current"
            aria-hidden="true"
          />
        </span>
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wide">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
