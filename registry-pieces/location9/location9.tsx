"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sky" | "violet";

interface Point {
  x: number;
  y: number;
}

interface Location9Props {
  courier?: string;
  destination?: string;
  etaMinutes?: number;
  tripMs?: number;
  holdMs?: number;
  tone?: Tone;
  className?: string;
}

const routeClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  emerald: "bg-emerald-500 text-white",
  sky: "bg-sky-500 text-white",
  violet: "bg-violet-500 text-white",
};

const W = 240;
const H = 132;
const GRID = 24;

const ROUTE: Point[] = [
  { x: 18, y: 104 },
  { x: 66, y: 104 },
  { x: 66, y: 56 },
  { x: 126, y: 56 },
  { x: 126, y: 28 },
  { x: 182, y: 28 },
  { x: 182, y: 80 },
  { x: 222, y: 80 },
];

const LAST = ROUTE.length - 1;

function vertex(index: number): Point {
  return ROUTE[Math.min(Math.max(0, index), LAST)] ?? { x: 0, y: 0 };
}

// One leg per straight segment, so the marker never interpolates across a corner.
const SEGMENTS: number[] = ROUTE.slice(1).map((p, i) => {
  const prev = vertex(i);
  return Math.hypot(p.x - prev.x, p.y - prev.y);
});

const TRAVELLED: number[] = [0];
for (const len of SEGMENTS) {
  TRAVELLED.push((TRAVELLED[TRAVELLED.length - 1] ?? 0) + len);
}

const LENGTH = TRAVELLED[LAST] || 1;
const PATH = ROUTE.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

export const location9Demo: Location9Props = {
  courier: "Fela Kuti",
  destination: "Studio B, 14 Kreuzberg St",
  etaMinutes: 12,
  tone: "sky",
};

export function Location9({
  courier = "Courier",
  destination = "Destination",
  etaMinutes = 12,
  tripMs = 9000,
  holdMs = 2600,
  tone = "sky",
  className,
}: Location9Props) {
  const [state, setState] = useState({ leg: 0, jump: false });

  const leg = Math.min(state.leg, LAST);
  const arrived = leg >= LAST;
  const legMs = leg > 0 ? tripMs * ((SEGMENTS[leg - 1] ?? 0) / LENGTH) : 0;

  useEffect(() => {
    if (!arrived) {
      const wait = leg === 0 ? 80 : legMs;
      const id = setTimeout(
        () => setState({ leg: leg + 1, jump: false }),
        wait
      );
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setState({ leg: 0, jump: true }), holdMs);
    return () => clearTimeout(id);
  }, [leg, arrived, legMs, holdMs]);

  const progress = (TRAVELLED[leg] ?? 0) / LENGTH;
  const here = vertex(leg);
  const start = vertex(0);
  const end = vertex(LAST);
  const minutes = Math.max(1, Math.ceil(etaMinutes * (1 - progress)));
  const duration = state.jump ? "0ms" : `${legMs}ms`;
  const initialsText = courier
    .split(" ")
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative h-36 w-full overflow-hidden rounded-lg bg-muted">
          <svg viewBox={`0 0 ${W} ${H}`} className="size-full" aria-hidden="true">
            <g className="text-border" stroke="currentColor" strokeWidth={1}>
              {Array.from({ length: Math.floor(W / GRID) }, (_, i) => (
                <line key={`v${i}`} x1={(i + 1) * GRID} y1={0} x2={(i + 1) * GRID} y2={H} />
              ))}
              {Array.from({ length: Math.floor(H / GRID) }, (_, i) => (
                <line key={`h${i}`} x1={0} y1={(i + 1) * GRID} x2={W} y2={(i + 1) * GRID} />
              ))}
            </g>

            <path
              d={PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="3 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
              strokeOpacity={0.4}
            />
            <path
              d={PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className={cn("transition-all ease-linear motion-reduce:transition-none", routeClasses[tone])}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 - progress, transitionDuration: duration }}
            />

            <circle cx={start.x} cy={start.y} r={3} fill="currentColor" className="text-muted-foreground" />
            <g
              className={cn(
                "transition-colors duration-500",
                arrived ? "text-emerald-500" : "text-card-foreground"
              )}
            >
              <MapPin x={end.x - 8} y={end.y - 16} size={16} strokeWidth={2.25} />
            </g>

            <g
              className={cn("transition-transform ease-linear motion-reduce:transition-none", routeClasses[tone])}
              style={{ transform: `translate(${here.x}px, ${here.y}px)`, transitionDuration: duration }}
            >
              <circle r={9} fill="currentColor" opacity={0.2} />
              <circle r={5} fill="currentColor" className="text-card" />
              <circle r={3.5} fill="currentColor" />
            </g>
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              tileClasses[tone]
            )}
            aria-hidden="true"
          >
            {initialsText}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-card-foreground">{courier}</p>
            <p className="truncate text-xs text-muted-foreground">
              {arrived ? "Delivered to" : "Heading to"} {destination}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <span
              className={cn(
                "text-base font-semibold tabular-nums transition-colors duration-500",
                arrived ? "text-emerald-500" : "text-card-foreground"
              )}
            >
              {arrived ? "Arrived" : `${minutes} min`}
            </span>
            <span className="text-xs text-muted-foreground">{arrived ? "On time" : "ETA"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
