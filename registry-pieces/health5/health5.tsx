"use client";

import { cn } from "@/lib/utils";

interface Ring {
  label: string;
  value: string;
  goal: string;
  pct: number;
  text: string;
  stroke: string;
}

interface Health5Props {
  rings?: Ring[];
  className?: string;
}

const defaultRings: Ring[] = [
  {
    label: "Move",
    value: "420",
    goal: "600 kcal",
    pct: 70,
    text: "text-rose-500",
    stroke: "stroke-rose-500",
  },
  {
    label: "Exercise",
    value: "32",
    goal: "45 min",
    pct: 71,
    text: "text-emerald-500",
    stroke: "stroke-emerald-500",
  },
  {
    label: "Stand",
    value: "10",
    goal: "12 hr",
    pct: 83,
    text: "text-sky-500",
    stroke: "stroke-sky-500",
  },
];

export const health5Demo: Health5Props = {
  rings: defaultRings,
};

export function Health5({
  rings = defaultRings,
  className,
}: Health5Props) {
  const radii = [28, 21, 14];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          className="-rotate-90 shrink-0"
          aria-hidden="true"
        >
          {rings.map((ring, idx) => {
            const r = radii[idx] ?? 28;
            const circ = 2 * Math.PI * r;
            const dash = (ring.pct / 100) * circ;
            return (
              <g key={idx}>
                <circle
                  cx="40"
                  cy="40"
                  r={r}
                  fill="none"
                  strokeWidth="5"
                  className="stroke-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r={r}
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className={ring.stroke}
                  strokeDasharray={`${dash} ${circ}`}
                />
              </g>
            );
          })}
        </svg>
        <div className="flex flex-col gap-1.5">
          {rings.map((ring, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className={cn("size-2 rounded-full bg-current", ring.text)}
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {ring.label}
                </span>
                <span className="font-mono text-xs text-card-foreground">
                  <span className="font-semibold">{ring.value}</span>
                  <span className="text-muted-foreground"> / {ring.goal}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
