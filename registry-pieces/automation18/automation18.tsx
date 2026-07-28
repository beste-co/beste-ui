"use client";

import { cn } from "@/lib/utils";

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
  className?: string;
}

export const automation18Demo: Automation18Props = {
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
  className,
}: Automation18Props) {
  const total = days.reduce((s, d) => s + d.success + d.failed, 0);
  const totalFailed = days.reduce((s, d) => s + d.failed, 0);
  const successRate =
    total > 0 ? ((total - totalFailed) / total) * 100 : 100;
  const max = Math.max(...days.map((d) => d.success + d.failed), 1);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
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
                <span className="text-xs text-muted-foreground">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
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
