"use client";

import { cn } from "@/lib/utils";

type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

interface Weather8Props {
  speed?: number;
  unit?: string;
  direction?: Direction;
  gust?: number;
  className?: string;
}

const directionAngles: Record<Direction, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export const weather8Demo: Weather8Props = {
  speed: 12,
  unit: "km/h",
  direction: "NE",
  gust: 18,
};

export function Weather8({
  speed,
  unit = "km/h",
  direction = "N",
  gust,
  className,
}: Weather8Props) {
  const angle = directionAngles[direction];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 shadow-sm">
        <svg
          viewBox="0 0 100 100"
          className="size-20 shrink-0"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            className="stroke-border"
            strokeWidth="1"
          />
          <text
            x="50"
            y="18"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            className="fill-muted-foreground"
          >
            N
          </text>
          <text
            x="50"
            y="92"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            className="fill-muted-foreground"
          >
            S
          </text>
          <text
            x="14"
            y="55"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            className="fill-muted-foreground"
          >
            W
          </text>
          <text
            x="86"
            y="55"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            className="fill-muted-foreground"
          >
            E
          </text>
          <g transform={`rotate(${angle} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="26"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-sky-500"
            />
            <circle cx="50" cy="24" r="4" className="fill-sky-500" />
          </g>
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums text-card-foreground">
              {speed}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <span className="text-sm font-semibold text-card-foreground">
            {direction} wind
          </span>
          {typeof gust === "number" && (
            <span className="text-xs text-muted-foreground">
              Gust {gust} {unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
