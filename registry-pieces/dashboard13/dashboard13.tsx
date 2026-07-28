"use client";

import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Dashboard13Props {
  label?: string;
  current?: string;
  target?: string;
  ofLabel?: string;
  progress?: number;
  remaining?: string;
  deadline?: string;
  tone?: Tone;
  className?: string;
}

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const dashboard13Demo: Dashboard13Props = {
  label: "Q2 revenue goal",
  current: "$148K",
  target: "$240K",
  ofLabel: "of",
  progress: 62,
  remaining: "$92K to goal",
  deadline: "28 days left",
  tone: "emerald",
};

export function Dashboard13({
  label = "Goal",
  current = "—",
  target = "—",
  ofLabel = "of",
  progress = 0,
  remaining,
  deadline,
  tone = "violet",
  className,
}: Dashboard13Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <Target
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-xl font-semibold tabular-nums text-card-foreground">
            {current}
          </span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {ofLabel} {target}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          {remaining && <span>{remaining}</span>}
          {deadline && <span>{deadline}</span>}
        </div>
      </div>
    </div>
  );
}
