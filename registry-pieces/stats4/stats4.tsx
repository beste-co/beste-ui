"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Tone = "primary" | "foreground" | "success" | "rose";

interface Stats4Props {
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
  rose: "text-rose-500",
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

export const stats4Demo: Stats4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  label: "Active users · 30d",
  value: "128,420",
  data: [22, 28, 24, 34, 40, 38, 48, 52, 60, 58, 72, 84],
  tone: "success",
};

export function Stats4({
  label,
  value,
  data = [],
  tone = "primary",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Stats4Props) {
  const width = 100;
  const height = 30;
  const points = (() => {
    if (data.length === 0) return "";
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : 0;
    return data
      .map((d, i) => {
        const x = i * step;
        const y = height - ((d - min) / range) * (height - 4) - 2;
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
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg px-3 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex min-w-0 flex-1 flex-col">
          {label && (
            <span className="truncate text-xs font-medium uppercase tracking-wide text-current/60">
              {label}
            </span>
          )}
          <span className="text-2xl font-bold tabular-nums">
            {value}
          </span>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={cn("h-10 w-24", toneClasses[tone])}
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
