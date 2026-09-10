"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard9Slice {
  label: string;
  value: number;
}

interface Dashboard9Props {
  slices?: Dashboard9Slice[];
  total?: string;
  totalLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const PALETTE = [
  { stroke: "stroke-violet-500", dot: "bg-violet-500" },
  { stroke: "stroke-sky-500", dot: "bg-sky-500" },
  { stroke: "stroke-emerald-500", dot: "bg-emerald-500" },
  { stroke: "stroke-amber-500", dot: "bg-amber-500" },
];

const RADIUS = 22;
const CIRC = 2 * Math.PI * RADIUS;


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

export const dashboard9Demo: Dashboard9Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  slices: [
    { label: "Subscriptions", value: 52 },
    { label: "One-time", value: 28 },
    { label: "Add-ons", value: 14 },
    { label: "Refunds", value: 6 },
  ],
  total: "$48.2K",
  totalLabel: "Revenue",
};

export function Dashboard9({
  slices = [],
  total,
  totalLabel = "Total",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard9Props) {
  const sum = slices.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <svg
          className="size-16 shrink-0 -rotate-90"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          {slices.map((s, i) => {
            const frac = s.value / sum;
            const len = frac * CIRC;
            const offset = CIRC - (acc / sum) * CIRC;
            acc += s.value;
            const cls = PALETTE[i % PALETTE.length]!;
            return (
              <circle
                key={s.label}
                cx="28"
                cy="28"
                r={RADIUS}
                fill="none"
                strokeWidth="8"
                strokeDasharray={`${len} ${CIRC - len}`}
                strokeDashoffset={offset}
                className={cls.stroke}
              />
            );
          })}
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
              {totalLabel}
            </span>
            {total && (
              <span className="font-mono text-sm font-semibold tabular-nums">
                {total}
              </span>
            )}
          </div>
          <ul className="flex flex-col gap-0.5">
            {slices.map((s, i) => {
              const pct = Math.round((s.value / sum) * 100);
              const cls = PALETTE[i % PALETTE.length]!;
              return (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={cn("size-2 shrink-0 rounded-sm", cls.dot)}
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {s.label}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono tabular-nums text-current/60">
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
