"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "emerald";

interface Dashboard32Props {
  label?: string;
  value?: string;
  delta?: number;
  period?: string;
  data?: number[];
  tone?: Tone;
  className?: string;
}

const lineStyles: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600",
};

export const dashboard32Demo: Dashboard32Props = {
  label: "Collected this month",
  value: "$92.4K",
  delta: 8.6,
  period: "vs last month",
  data: [18, 24, 20, 32, 28, 40, 38, 52, 60],
};

export function Dashboard32({
  label = "Metric",
  value = "—",
  delta,
  period,
  data = [],
  tone = "primary",
  className,
}: Dashboard32Props) {
  const positive = typeof delta === "number" && delta >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 0;
      const y = 30 - ((v - min) / span) * 26 - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = data.length > 0 ? `0,32 ${points} 100,32` : "";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 rounded-md border border-border bg-card p-5 shadow-xl">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-card-foreground">
            {value}
          </span>
          {typeof delta === "number" && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                positive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              <TrendIcon className="size-4" aria-hidden="true" />
              {positive ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          )}
        </div>
        {data.length > 1 && (
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className={cn("mt-4 h-12 w-full", lineStyles[tone])}
            aria-hidden="true"
          >
            <polygon points={area} fill="currentColor" fillOpacity="0.1" />
            <polyline
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}
        {period && (
          <p className="mt-3 text-sm text-muted-foreground">{period}</p>
        )}
      </div>
    </div>
  );
}
