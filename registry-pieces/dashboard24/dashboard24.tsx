"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard24Props {
  title?: string;
  peak?: string;
  values?: number[];
  hourLabels?: string[];
  tone?: Tone;
  className?: string;
}

const fillClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const dashboard24Demo: Dashboard24Props = {
  title: "Last 24h",
  peak: "peak at 14:00",
  values: [
    2, 1, 0, 0, 1, 2, 4, 8, 14, 22, 28, 34, 38, 42, 48, 40, 36, 30, 22, 18, 14,
    10, 6, 4,
  ],
  hourLabels: ["00", "06", "12", "18", "24"],
  tone: "violet",
};

export function Dashboard24({
  title = "24h activity",
  peak,
  values = [],
  hourLabels = ["00", "06", "12", "18", "24"],
  tone = "violet",
  className,
}: Dashboard24Props) {
  const max = Math.max(...values, 1);

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
          {peak && (
            <span className="font-mono text-xs text-muted-foreground">
              {peak}
            </span>
          )}
        </div>
        <div className="flex h-8 items-end gap-0.5">
          {values.map((v, i) => {
            const h = Math.max(6, (v / max) * 100);
            return (
              <span
                key={i}
                className={cn("flex-1 rounded-sm", fillClasses[tone])}
                style={{ height: `${h}%`, opacity: Math.max(0.3, v / max) }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          {hourLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
