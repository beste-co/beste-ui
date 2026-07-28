"use client";

import { cn } from "@/lib/utils";

type SliceTone =
  | "primary"
  | "foreground"
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "violet";

interface Slice {
  label: string;
  value: number;
  tone: SliceTone;
}

interface Chart4Props {
  slices?: Slice[];
  className?: string;
}

const toneColor: Record<SliceTone, string> = {
  primary: "var(--primary)",
  foreground: "var(--foreground)",
  indigo: "rgb(99 102 241)",
  emerald: "rgb(16 185 129)",
  amber: "rgb(245 158 11)",
  rose: "rgb(239 68 68)",
  sky: "rgb(14 165 233)",
  violet: "rgb(139 92 246)",
};

export const chart4Demo: Chart4Props = {
  slices: [
    { label: "Direct", value: 48, tone: "indigo" },
    { label: "Referral", value: 24, tone: "emerald" },
    { label: "Social", value: 18, tone: "amber" },
    { label: "Search", value: 10, tone: "rose" },
  ],
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polar(cx, cy, r, end);
  const endPt = polar(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArc} 0 ${endPt.x} ${endPt.y} Z`;
}

export function Chart4({ slices = [], className }: Chart4Props) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const size = 88;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;

  let cursor = 0;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          {slices.map((slice, i) => {
            const angle = (slice.value / total) * 360;
            const path = arc(cx, cy, radius, cursor, cursor + angle);
            cursor += angle;
            return <path key={i} d={path} fill={toneColor[slice.tone]} />;
          })}
        </svg>
        <ul className="flex flex-col gap-1">
          {slices.map((slice, i) => {
            const pct = Math.round((slice.value / total) * 100);
            return (
              <li
                key={i}
                className="flex items-center gap-2 text-xs"
              >
                <span
                  className="size-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: toneColor[slice.tone] }}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{slice.label}</span>
                <span className="ml-auto font-semibold tabular-nums text-card-foreground">
                  {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
