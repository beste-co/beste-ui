"use client";

import { cn } from "@/lib/utils";

interface Money15Props {
  label?: string;
  value?: string;
  delta?: string;
  period?: string;
  points?: number[];
  className?: string;
}

export const money15Demo: Money15Props = {
  label: "Portfolio",
  value: "$52,840",
  delta: "+12.4%",
  period: "Past 12 months",
  points: [20, 24, 22, 30, 28, 36, 33, 42, 48, 45, 56, 62],
};

function buildPath(points: number[]) {
  if (points.length < 2) return "";
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = 100 / (points.length - 1);
  return points
    .map((p, i) => {
      const x = (i * stepX).toFixed(2);
      const y = (26 - ((p - min) / range) * 24).toFixed(2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function Money15({
  label,
  value = "$0",
  delta,
  period,
  points = [],
  className,
}: Money15Props) {
  const path = buildPath(points);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            {label && (
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            )}
            <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
              {value}
            </span>
          </div>
          {delta && (
            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
              {delta}
            </span>
          )}
        </div>
        {path && (
          <svg
            viewBox="0 0 100 28"
            preserveAspectRatio="none"
            className="h-9 w-full text-foreground"
            aria-hidden="true"
          >
            <path
              d={path}
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
          <span className="text-xs text-muted-foreground">{period}</span>
        )}
      </div>
    </div>
  );
}
