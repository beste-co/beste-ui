"use client";

import { cn } from "@/lib/utils";

type Tone = "foreground" | "primary" | "success" | "muted";

interface Card2Props {
  label?: string;
  value?: string;
  data?: number[];
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  foreground: "text-foreground",
  primary: "text-primary",
  success: "text-emerald-500",
  muted: "text-muted-foreground",
};

export const card2Demo: Card2Props = {
  label: "Revenue · 30d",
  value: "$48.2k",
  data: [12, 18, 14, 22, 20, 28, 24, 32, 30, 38, 36, 44],
  tone: "success",
};

export function Card2({
  label,
  value,
  data = [],
  tone = "primary",
  className,
}: Card2Props) {
  const width = 160;
  const height = 40;

  const points = (() => {
    if (data.length === 0) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : 0;
    return data
      .map((d, i) => {
        const x = i * step;
        const y = height - ((d - min) / range) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  })();

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-52 flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <span className="text-sm font-semibold tabular-nums text-card-foreground">
            {value}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={cn("w-full", toneClasses[tone])}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
