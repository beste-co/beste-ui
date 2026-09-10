"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "success" | "warning";

interface Chart5Props {
  label?: string;
  value?: string;
  data?: number[];
  tone?: Tone;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  success: "text-emerald-500",
  warning: "text-amber-500",
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

export const chart5Demo: Chart5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
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

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-56 flex-col gap-2 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-current/60">
            {label}
          </span>
          <span className="text-sm font-semibold tabular-nums">
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
