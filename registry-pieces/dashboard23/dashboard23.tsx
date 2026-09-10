"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard23Segment {
  label: string;
  value: number;
}

interface Dashboard23Props {
  title?: string;
  total?: string;
  segments?: Dashboard23Segment[];
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const PALETTE = [
  { bar: "bg-violet-500", dot: "bg-violet-500" },
  { bar: "bg-sky-500", dot: "bg-sky-500" },
  { bar: "bg-emerald-500", dot: "bg-emerald-500" },
  { bar: "bg-amber-500", dot: "bg-amber-500" },
  { bar: "bg-rose-500", dot: "bg-rose-500" },
];


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

export const dashboard23Demo: Dashboard23Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Traffic by device",
  total: "9,420 sessions",
  segments: [
    { label: "Mobile", value: 58 },
    { label: "Desktop", value: 32 },
    { label: "Tablet", value: 8 },
    { label: "Other", value: 2 },
  ],
};

export function Dashboard23({
  title = "Split",
  total,
  segments = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard23Props) {
  const sum = segments.reduce((s, x) => s + x.value, 0) || 1;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {title}
          </span>
          {total && (
            <span className="font-mono text-xs text-current/60">
              {total}
            </span>
          )}
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-sm">
          {segments.map((s, i) => {
            const pct = (s.value / sum) * 100;
            const cls = PALETTE[i % PALETTE.length]!;
            return (
              <span
                key={s.label}
                className={cls.bar}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {segments.map((s, i) => {
            const pct = Math.round((s.value / sum) * 100);
            const cls = PALETTE[i % PALETTE.length]!;
            return (
              <li
                key={s.label}
                className="flex items-center gap-1.5 text-xs"
              >
                <span
                  className={cn("size-2 rounded-sm", cls.dot)}
                  aria-hidden="true"
                />
                <span className="">{s.label}</span>
                <span className="font-mono tabular-nums text-current/60">
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
