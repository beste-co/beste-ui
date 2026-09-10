"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "emerald";

interface Dashboard32Props {
  label?: string;
  value?: string;
  delta?: number;
  period?: string;
  data?: number[];
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const lineStyles: Record<Tone, string> = {
  primary: "text-primary",
  emerald: "text-emerald-600",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const dashboard32Demo: Dashboard32Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Collected this month",
  value: "$92.4K",
  delta: 8.6,
  period: "vs last month",
  data: [18, 24, 20, 32, 28, 40, 38, 52, 60],
};

export function Dashboard32({
  label = "Metric",
  value = "—",
  delta,
  period,
  data = [],
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard32Props) {
  const positive = typeof delta === "number" && delta >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 0;
      const y = 30 - ((v - min) / span) * 26 - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = data.length > 0 ? `0,32 ${points} 100,32` : "";

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md p-5 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <p className="text-sm font-medium text-current/60">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight">
            {value}
          </span>
          {typeof delta === "number" && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-sm font-medium",
                positive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              <TrendIcon className="size-4" aria-hidden="true" />
              {positive ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          )}
        </div>
        {data.length > 1 && (
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className={cn("mt-4 h-12 w-full", lineStyles[tone])}
            aria-hidden="true"
          >
            <polygon points={area} fill="currentColor" fillOpacity="0.1" />
            <polyline
              points={points}
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
          <p className="mt-3 text-sm text-current/60">{period}</p>
        )}
      </div>
    </div>
  );
}
