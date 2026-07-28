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

interface Monitoring6Props {
  label?: string;
  metric?: string;
  value?: string;
  data?: number[];
  tone?: Tone;
  className?: string;
}

const lineClasses: Record<Tone, string> = {
  neutral: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const tagClasses: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

function buildPaths(data: number[], width: number, height: number) {
  if (data.length < 2) return { line: "", area: "" };
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 2) - 1;
    return [x, y] as const;
  });
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(" ");
  const area = `M 0 ${height} ${line.replace(/^M/, "L")} L ${width} ${height} Z`;
  return { line, area };
}

export const monitoring6Demo: Monitoring6Props = {
  label: "Response time",
  metric: "p95",
  value: "182ms",
  data: [120, 138, 124, 156, 142, 168, 154, 172, 148, 182, 176, 182],
  tone: "violet",
};

export function Monitoring6({
  label = "Latency",
  metric = "p95",
  value,
  data = [],
  tone = "violet",
  className,
}: Monitoring6Props) {
  const { line, area } = buildPaths(data, 100, 30);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
                tagClasses[tone]
              )}
            >
              {metric}
            </span>
            <span className="truncate text-xs font-medium text-muted-foreground">
              {label}
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums text-card-foreground">
            {value}
          </span>
        </div>
        <svg
          viewBox="0 0 100 30"
          preserveAspectRatio="none"
          className={cn("h-8 w-full", lineClasses[tone])}
          aria-hidden="true"
        >
          {area && <path d={area} fill="currentColor" opacity={0.12} />}
          {line && (
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
