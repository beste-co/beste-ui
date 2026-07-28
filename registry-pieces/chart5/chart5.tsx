"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "success" | "warning";

interface Chart5Props {
  label?: string;
  value?: string;
  data?: number[];
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  success: "text-emerald-500",
  warning: "text-amber-500",
};

export const chart5Demo: Chart5Props = {
  label: "MRR · 90d",
  value: "$124K",
  data: [20, 28, 24, 34, 40, 38, 48, 52, 60, 58, 72, 84],
  tone: "success",
};

export function Chart5({
  label,
  value,
  data = [],
  tone = "primary",
  className,
}: Chart5Props) {
  const width = 180;
  const height = 60;
  const gradientId = `chart5-grad-${tone}`;

  const { line, area } = (() => {
    if (data.length === 0) return { line: "", area: "" };
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : 0;
    const points = data.map((d, i) => {
      const x = i * step;
      const y = height - ((d - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const linePath = `M ${points.join(" L ")}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
    return { line: linePath, area: areaPath };
  })();

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-56 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
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
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
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
