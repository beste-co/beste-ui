"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SliceTone = "primary" | "sky" | "violet" | "emerald" | "amber" | "rose";

interface Slice {
  label: string;
  value: number;
  tone?: SliceTone;
}

interface Dashboard34Props {
  title?: string;
  range?: string;
  totalLabel?: string;
  prefix?: string;
  slices?: Slice[];
  sweepMs?: number;
  className?: string;
}

const strokeClasses: Record<SliceTone, string> = {
  primary: "text-primary",
  sky: "text-sky-500",
  violet: "text-violet-500",
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

const dotClasses: Record<SliceTone, string> = {
  primary: "bg-primary",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const GAP = 1.5;

export const dashboard34Demo: Dashboard34Props = {
  title: "Revenue by plan",
  range: "This quarter",
  totalLabel: "total",
  prefix: "$",
  slices: [
    { label: "Enterprise", value: 61200, tone: "primary" },
    { label: "Pro", value: 38400, tone: "sky" },
    { label: "Starter", value: 17900, tone: "violet" },
    { label: "Add-ons", value: 8300, tone: "emerald" },
  ],
};

export function Dashboard34({
  title = "Breakdown",
  range,
  totalLabel = "total",
  prefix = "",
  slices = [],
  sweepMs = 1600,
  className,
}: Dashboard34Props) {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / sweepMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(total * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, sweepMs]);

  let cursor = 0;
  const segments = slices.map((s) => {
    const pct = total ? (s.value / total) * 100 : 0;
    const seg = { ...s, pct, before: cursor };
    cursor += pct;
    return seg;
  });

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{`@keyframes dashboard34-in { from { opacity: 0; transform: translateX(0.5rem); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-sm font-medium text-card-foreground">{title}</span>
          {range && <span className="shrink-0 text-xs text-muted-foreground">{range}</span>}
        </div>

        <p className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold tabular-nums text-card-foreground">
            {prefix}
            {count.toLocaleString("en-US")}
          </span>
          <span className="text-sm text-muted-foreground">{totalLabel}</span>
        </p>

        <div className="flex items-center gap-4">
          <svg
            viewBox="0 0 120 120"
            className="size-24 shrink-0 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={60}
              cy={60}
              r={46}
              fill="none"
              stroke="currentColor"
              strokeWidth={12}
              className="text-muted"
            />
            {segments.map((seg, i) => {
              const visible = Math.max(0, seg.pct - GAP);
              return (
                <circle
                  key={i}
                  cx={60}
                  cy={60}
                  r={46}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={12}
                  pathLength={100}
                  className={cn(
                    "transition-all ease-linear motion-reduce:transition-none",
                    strokeClasses[seg.tone ?? "primary"]
                  )}
                  style={{
                    strokeDasharray: ready ? `${visible} ${100 - visible}` : "0 100",
                    strokeDashoffset: 100 - seg.before,
                    transitionDuration: `${Math.round((seg.pct / 100) * sweepMs)}ms`,
                    transitionDelay: `${Math.round((seg.before / 100) * sweepMs)}ms`,
                  }}
                />
              );
            })}
          </svg>

          <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
            {segments.map((seg, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-sm"
                style={{
                  animation: "dashboard34-in 450ms ease-out both",
                  animationDelay: `${Math.round((seg.before / 100) * sweepMs) + 200}ms`,
                }}
              >
                <span
                  className={cn("size-2 shrink-0 rounded-full", dotClasses[seg.tone ?? "primary"])}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-card-foreground">{seg.label}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {Math.round(seg.pct)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
