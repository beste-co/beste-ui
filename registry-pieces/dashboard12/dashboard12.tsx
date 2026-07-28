"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard12Props {
  heading?: string;
  cohorts?: string[];
  weeks?: string[];
  retention?: number[][];
  tone?: Tone;
  className?: string;
}

const cellClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const dashboard12Demo: Dashboard12Props = {
  heading: "Retention",
  cohorts: ["W0", "W1", "W2", "W3"],
  weeks: ["W0", "W1", "W2", "W3", "W4"],
  retention: [
    [100, 64, 48, 41, 38],
    [100, 71, 55, 46, 0],
    [100, 68, 52, 0, 0],
    [100, 74, 0, 0, 0],
  ],
  tone: "violet",
};

export function Dashboard12({
  heading = "Retention",
  cohorts = [],
  weeks = [],
  retention = [],
  tone = "violet",
  className,
}: Dashboard12Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {heading}
        </span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="w-7 shrink-0" aria-hidden="true" />
            {weeks.map((w) => (
              <span
                key={w}
                className="flex-1 text-center font-mono text-xs text-muted-foreground"
              >
                {w}
              </span>
            ))}
          </div>
          {retention.map((row, r) => (
            <div key={r} className="flex items-center gap-1">
              <span className="w-7 shrink-0 font-mono text-xs text-muted-foreground">
                {cohorts[r]}
              </span>
              {row.map((v, c) => {
                if (v === 0) {
                  return <span key={c} className="flex-1" aria-hidden="true" />;
                }
                return (
                  <div
                    key={c}
                    className="relative flex flex-1 items-center justify-center rounded-sm py-1"
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-sm",
                        cellClasses[tone]
                      )}
                      style={{ opacity: Math.max(0.1, v / 100) }}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "relative font-mono text-xs tabular-nums",
                        v >= 60
                          ? "font-semibold text-white"
                          : "text-card-foreground"
                      )}
                    >
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
