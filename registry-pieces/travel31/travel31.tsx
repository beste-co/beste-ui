"use client";

import { useEffect, useState } from "react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Airport {
  code: string;
  time: string;
  city?: string;
}

interface Travel31Props {
  flight?: string;
  from?: Airport;
  to?: Airport;
  remainingMinutes?: number;
  steps?: number;
  stepMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const trailClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

const ARC = "M 16 70 Q 140 -14 264 70";

function formatRemaining(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

export const travel31Demo: Travel31Props = {
  flight: "BA 117",
  from: { code: "LHR", time: "09:40", city: "London" },
  to: { code: "JFK", time: "12:50", city: "New York" },
  remainingMinutes: 130,
  tone: "sky",
};

export function Travel31({
  flight = "Flight",
  from = { code: "AAA", time: "00:00" },
  to = { code: "BBB", time: "00:00" },
  remainingMinutes = 130,
  steps = 20,
  stepMs = 300,
  holdMs = 2600,
  tone = "sky",
  className,
}: Travel31Props) {
  const [state, setState] = useState({ step: 0, cycle: 0 });

  useEffect(() => {
    if (state.step < steps) {
      const id = setTimeout(() => setState((s) => ({ ...s, step: s.step + 1 })), stepMs);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setState((s) => ({ step: 0, cycle: s.cycle + 1 })), holdMs);
    return () => clearTimeout(id);
  }, [state.step, steps, stepMs, holdMs]);

  const progress = steps ? state.step / steps : 1;
  const landed = progress >= 1;
  const remaining = Math.round(remainingMinutes * (1 - progress));
  const flightMs = steps * stepMs;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">{flight}</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-500",
              landed
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
            )}
          >
            {landed ? "Landed" : "In flight"}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-semibold tracking-tight text-card-foreground">{from.code}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {from.time}
              {from.city ? ` · ${from.city}` : ""}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-semibold tracking-tight text-card-foreground">{to.code}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {to.time}
              {to.city ? ` · ${to.city}` : ""}
            </span>
          </div>
        </div>

        <svg
          key={state.cycle}
          viewBox="0 0 280 84"
          className={cn("h-auto w-full overflow-visible", trailClasses[tone])}
          aria-hidden="true"
        >
          <path
            d={ARC}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeDasharray="2 5"
            strokeLinecap="round"
            className="text-muted-foreground"
            strokeOpacity={0.4}
          />
          <path
            d={ARC}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            className="transition-all ease-linear motion-reduce:transition-none"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1 - progress,
              transitionDuration: state.step === 0 ? "0ms" : `${stepMs}ms`,
            }}
          />
          <circle cx={16} cy={70} r={3.5} fill="currentColor" />
          <circle
            cx={264}
            cy={70}
            r={3.5}
            fill="currentColor"
            className={cn("transition-colors duration-500", landed ? "text-emerald-500" : "text-muted-foreground")}
          />
          <g>
            <animateMotion
              dur={`${flightMs}ms`}
              path={ARC}
              rotate="auto"
              fill="freeze"
              calcMode="linear"
            />
            <g transform="rotate(45)">
              <circle r={9} fill="currentColor" className="text-card" />
              <Plane x={-7} y={-7} size={14} strokeWidth={2.25} fill="currentColor" />
            </g>
          </g>
        </svg>

        <div className="flex items-center justify-between">
          <span className="text-sm text-card-foreground">
            {landed ? `Arrived at ${to.code}` : `Landing in ${formatRemaining(remaining)}`}
          </span>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
