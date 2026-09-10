"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation18Day {
  label: string;
  success: number;
  failed: number;
}

interface Automation18Props {
  title?: string;
  days?: Automation18Day[];
  runsSuffix?: string;
  failedSuffix?: string;
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

export const automation18Demo: Automation18Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Last 7 days",
  days: [
    { label: "Mon", success: 38, failed: 0 },
    { label: "Tue", success: 42, failed: 1 },
    { label: "Wed", success: 51, failed: 0 },
    { label: "Thu", success: 33, failed: 2 },
    { label: "Fri", success: 48, failed: 0 },
    { label: "Sat", success: 29, failed: 1 },
    { label: "Sun", success: 43, failed: 1 },
  ],
  runsSuffix: "runs",
  failedSuffix: "failed",
};

export function Automation18({
  title = "Run stats",
  days = [],
  runsSuffix = "runs",
  failedSuffix = "failed",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation18Props) {
  const total = days.reduce((s, d) => s + d.success + d.failed, 0);
  const totalFailed = days.reduce((s, d) => s + d.failed, 0);
  const successRate =
    total > 0 ? ((total - totalFailed) / total) * 100 : 100;
  const max = Math.max(...days.map((d) => d.success + d.failed), 1);

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
          <span className="font-mono text-sm font-semibold tabular-nums">
            {successRate.toFixed(1)}%
          </span>
        </div>
        <div className="flex h-14 items-end gap-1.5">
          {days.map((d) => {
            const h = ((d.success + d.failed) / max) * 100;
            const successPct = (d.success / Math.max(1, d.success + d.failed)) * 100;
            return (
              <div
                key={d.label}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex h-10 w-full items-end">
                  <div
                    className="flex w-full flex-col overflow-hidden rounded-sm"
                    style={{ height: `${Math.max(8, h)}%` }}
                  >
                    {d.failed > 0 && (
                      <span
                        className="bg-rose-500"
                        style={{ height: `${100 - successPct}%` }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="flex-1 bg-emerald-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <span className="text-xs text-current/60">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-current/60">
          <span>
            {total.toLocaleString()} {runsSuffix}
          </span>
          {totalFailed > 0 && (
            <span className="text-rose-600 dark:text-rose-400">
              {totalFailed} {failedSuffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
