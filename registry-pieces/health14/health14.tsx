"use client";

import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Health14Props {
  bedtime?: string;
  wake?: string;
  target?: string;
  consistency?: number;
  note?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const health14Demo: Health14Props = {
  bedtime: "23:15",
  wake: "06:45",
  target: "8 hours",
  consistency: 92,
  note: "6 days on schedule this week",
  label: "Sleep schedule",
  tone: "violet",
};

export function Health14({
  bedtime,
  wake,
  target,
  consistency = 0,
  note,
  label = "Sleep schedule",
  tone = "violet",
  className,
}: Health14Props) {
  const pct = Math.max(0, Math.min(100, consistency));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {target && (
            <span className="text-xs text-muted-foreground">
              Target {target}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Bedtime</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {bedtime}
            </span>
          </div>
          <span
            className="flex-1 border-t border-dashed border-border"
            aria-hidden="true"
          />
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Wake</span>
            <span className="font-mono text-lg font-bold text-card-foreground">
              {wake}
            </span>
          </div>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
          />
        </div>
        {note && (
          <span className="text-xs text-muted-foreground">{note}</span>
        )}
      </div>
    </div>
  );
}
