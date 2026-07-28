"use client";

import { cn } from "@/lib/utils";

type Tone = "primary" | "foreground" | "emerald" | "sunset" | "rose";

interface Progress8Props {
  value?: number;
  label?: string;
  unit?: string;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  emerald: "text-emerald-500",
  sunset: "text-orange-500",
  rose: "text-rose-500",
};

export const progress8Demo: Progress8Props = {
  value: 78,
  label: "Load",
  unit: "%",
  tone: "emerald",
};

export function Progress8({
  value = 0,
  label,
  unit = "%",
  tone = "primary",
  className,
}: Progress8Props) {
  const pct = Math.max(0, Math.min(100, value));
  const width = 140;
  const height = 80;
  const cx = width / 2;
  const cy = height;
  const radius = 60;
  const strokeWidth = 12;

  // Half-circle arc: 180 -> 0 (left to right over the top)
  const startAngle = Math.PI;
  const endAngle = 0;
  const currentAngle = Math.PI - (pct / 100) * Math.PI;

  const polar = (angle: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy - radius * Math.sin(angle),
  });

  const start = polar(startAngle);
  const end = polar(endAngle);
  const current = polar(currentAngle);

  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  const fillPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${current.x} ${current.y}`;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center">
        <svg
          width={width}
          height={height + strokeWidth}
          viewBox={`0 0 ${width} ${height + strokeWidth}`}
          className={toneClasses[tone]}
          aria-hidden="true"
        >
          <path
            d={trackPath}
            fill="none"
            className="text-muted"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <path
            d={fillPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
        <div className="-mt-6 flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {pct}
            <span className="text-sm font-semibold text-muted-foreground">
              {unit}
            </span>
          </span>
          {label && (
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
