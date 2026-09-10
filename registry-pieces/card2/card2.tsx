"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "foreground" | "primary" | "success" | "muted";

interface Card2Props {
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
  foreground: "text-foreground",
  primary: "text-primary",
  success: "text-emerald-500",
  muted: "text-current/60",
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

export const card2Demo: Card2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Revenue · 30d",
  value: "$48.2k",
  data: [12, 18, 14, 22, 20, 28, 24, 32, 30, 38, 36, 44],
  tone: "success",
};

export function Card2({
  label,
  value,
  data = [],
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Card2Props) {
  const width = 160;
  const height = 40;

  const points = (() => {
    if (data.length === 0) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : 0;
    return data
      .map((d, i) => {
        const x = i * step;
        const y = height - ((d - min) / range) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  })();

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-52 flex-col gap-1.5 rounded-lg px-3 py-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
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
          <polyline
            points={points}
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
