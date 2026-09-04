"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Chart8Props {
  label?: string;
  caption?: string;
  values?: number[];
  prefix?: string;
  suffix?: string;
  drawMs?: number;
  tone?: Tone;
  className?: string;
}

const strokeClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

export const chart8Demo: Chart8Props = {
  label: "Monthly recurring revenue",
  caption: "Last 12 months",
  values: [18.2, 21.4, 20.9, 24.8, 27.1, 26.4, 30.2, 33.8, 33.1, 38.6, 41.9, 46.3],
  prefix: "$",
  suffix: "k",
  tone: "emerald",
};

const W = 240;
const H = 84;
const TOP = 18;
const SIDE = 8;
const BOTTOM = 6;

export function Chart8({
  label = "Metric",
  caption,
  values = [0, 1],
  prefix = "",
  suffix = "",
  drawMs = 1400,
  tone = "emerald",
  className,
}: Chart8Props) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDrawn(true), 80);
    return () => clearTimeout(id);
  }, []);

  const series = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const points = series.map((v, i) => ({
    x: SIDE + (i / (series.length - 1)) * (W - SIDE * 2),
    y: TOP + (1 - (v - min) / range) * (H - TOP - BOTTOM),
  }));
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L ${last.x.toFixed(1)} ${H} L ${first.x.toFixed(1)} ${H} Z`;
  const current = series[series.length - 1];
  const start = series[0];
  const delta = start ? ((current - start) / Math.abs(start)) * 100 : 0;
  const currentText = `${prefix}${current.toLocaleString("en-US", { maximumFractionDigits: 1 })}${suffix}`;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes chart8-pulse { 0% { transform: scale(1); opacity: 0.45; } 100% { transform: scale(3.2); opacity: 0; } }`}</style>
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-card-foreground">{label}</span>
            {caption && (
              <span className="truncate text-xs text-muted-foreground">{caption}</span>
            )}
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums transition-opacity duration-500 ease-out motion-reduce:transition-none",
              delta >= 0
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
              drawn ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: `${drawMs}ms` }}
          >
            {delta >= 0 ? (
              <TrendingUp className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3" aria-hidden="true" />
            )}
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        </div>

        <span className="sr-only">{currentText}</span>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={cn("h-auto w-full overflow-visible", strokeClasses[tone])}
          aria-hidden="true"
        >
          <path
            d={area}
            fill="currentColor"
            fillOpacity={0.12}
            className="transition-opacity duration-700 ease-out motion-reduce:transition-none"
            style={{ opacity: drawn ? 1 : 0, transitionDelay: `${Math.round(drawMs * 0.6)}ms` }}
          />
          <path
            d={line}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="transition-all ease-out motion-reduce:transition-none"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: drawn ? 0 : 1,
              transitionDuration: `${drawMs}ms`,
            }}
          />
          <g
            className="transition-opacity duration-500 ease-out motion-reduce:transition-none"
            style={{ opacity: drawn ? 1 : 0, transitionDelay: `${drawMs}ms` }}
          >
            <circle
              cx={last.x}
              cy={last.y}
              r={4}
              fill="currentColor"
              style={{
                animation: "chart8-pulse 2200ms ease-out infinite",
                transformOrigin: `${last.x}px ${last.y}px`,
              }}
            />
            <circle cx={last.x} cy={last.y} r={5} fill="currentColor" className="text-card" />
            <circle cx={last.x} cy={last.y} r={3} fill="currentColor" />
            <text
              x={last.x}
              y={last.y - 10}
              textAnchor="end"
              fill="currentColor"
              className="text-xs font-semibold tabular-nums text-card-foreground"
            >
              {currentText}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
