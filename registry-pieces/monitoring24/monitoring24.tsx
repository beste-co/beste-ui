"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface PayloadRow {
  label: string;
  /** Weight in kilobytes. A row that costs nothing stays at zero as the rest climb. */
  kb: number;
}

interface Monitoring24Props {
  title?: string;
  rows?: PayloadRow[];
  totalLabel?: string;
  unit?: string;
  /** How long every figure takes to reach its own weight. */
  countMs?: number;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const monitoring24Demo: Monitoring24Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Downloaded by this page",
  rows: [
    { label: "Markup", kb: 14 },
    { label: "Styles", kb: 9 },
    { label: "Fonts", kb: 31 },
    { label: "Animation library", kb: 0 },
  ],
  totalLabel: "Total",
  unit: "KB",
  countMs: 1100,
};

const STYLES = `
@keyframes monitoring24-in { from { opacity: 0; } to { opacity: 1; } }
.monitoring24-in { animation: monitoring24-in 300ms ease-out both; }
@media (prefers-reduced-motion: reduce) { .monitoring24-in { animation: none; } }
`;

const TICK_MS = 40;

export function Monitoring24({
  title,
  rows = [],
  totalLabel,
  unit = "KB",
  countMs = 1100,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Monitoring24Props) {
  const [progress, setProgress] = useState(0);
  const heaviest = rows.reduce((max, row) => Math.max(max, row.kb), 0);

  useEffect(() => {
    if (progress >= 1) return;
    const id = setTimeout(
      () => setProgress((value) => Math.min(1, value + TICK_MS / countMs)),
      TICK_MS
    );
    return () => clearTimeout(id);
  }, [progress, countMs]);

  const total = rows.reduce((sum, row) => sum + row.kb, 0);

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <style>{STYLES}</style>

      <div
        className={cn(
          "monitoring24-in flex w-full max-w-72 flex-col gap-3 rounded-xl p-4 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <span className="truncate text-xs font-medium text-current/60">
              {title}
            </span>
          )}
          <span className="shrink-0 text-xl font-light leading-none tabular-nums">
            {Math.round(total * progress)}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {rows.map((row) => {
            const free = row.kb === 0;
            const width = heaviest > 0 ? (row.kb / heaviest) * 100 * progress : 0;

            return (
              <div key={row.label} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate text-xs",
                    free
                      ? inverted
                        ? "text-emerald-400"
                        : "text-emerald-600 dark:text-emerald-400"
                      : ""
                  )}
                >
                  {row.label}
                </span>
                <span
                  className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-current/10"
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      free ? "bg-emerald-500" : "bg-current"
                    )}
                    style={{ width: `${width}%` }}
                  />
                </span>
                <span
                  className={cn(
                    "w-10 shrink-0 text-right text-xs tabular-nums",
                    free
                      ? inverted
                        ? "text-emerald-400"
                        : "text-emerald-600 dark:text-emerald-400"
                      : "text-current/60"
                  )}
                >
                  {Math.round(row.kb * progress)} {unit}
                </span>
              </div>
            );
          })}
        </div>

        {totalLabel && (
          <span className="text-xs text-current/60">{totalLabel}</span>
        )}
      </div>
    </div>
  );
}
