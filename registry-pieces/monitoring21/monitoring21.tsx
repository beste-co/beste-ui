"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Monitoring21Props {
  label?: string;
  unit?: string;
  baseline?: number;
  spread?: number;
  warnAt?: number;
  bars?: number;
  intervalMs?: number;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
};

export const monitoring21Demo: Monitoring21Props = {
  label: "API latency",
  unit: "ms",
  baseline: 120,
  spread: 60,
  warnAt: 200,
  tone: "sky",
};

function seed(i: number, baseline: number, spread: number): number {
  return Math.round(
    baseline + Math.sin(i * 1.3) * spread * 0.5 + Math.cos(i * 0.7) * spread * 0.3
  );
}

export function Monitoring21({
  label = "Latency",
  unit = "ms",
  baseline = 120,
  spread = 60,
  warnAt = 200,
  bars = 28,
  intervalMs = 600,
  tone = "sky",
  className,
}: Monitoring21Props) {
  const [series, setSeries] = useState<number[]>(() =>
    Array.from({ length: bars }, (_, i) => seed(i, baseline, spread))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? baseline;
        const drift = (Math.random() - 0.5) * spread;
        const pull = (baseline - last) * 0.3;
        const spike = Math.random() < 0.08 ? spread * 1.6 : 0;
        const next = Math.max(1, Math.round(last + drift + pull + spike));
        return [...prev.slice(1), next];
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [baseline, spread, intervalMs]);

  const current = series[series.length - 1] ?? baseline;
  const max = Math.max(warnAt * 1.2, ...series);
  const sorted = [...series].sort((a, b) => a - b);
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? current;
  const isWarn = current >= warnAt;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span
                  className={cn(
                    "absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
                    isWarn ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-1.5 rounded-full",
                    isWarn ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
              </span>
              {label}
            </span>
            <span
              className={cn(
                "text-2xl font-semibold tabular-nums transition-colors",
                isWarn ? "text-amber-500" : "text-card-foreground"
              )}
            >
              {current}
              <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                {unit}
              </span>
            </span>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
            p95 {p95}
            {unit}
          </span>
        </div>

        <div className="flex h-12 items-end gap-0.5" aria-hidden="true">
          {series.map((v, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-all duration-300 ease-out motion-reduce:transition-none",
                v >= warnAt ? "bg-amber-500" : barClasses[tone],
                i < series.length - 1 && "opacity-70"
              )}
              style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
