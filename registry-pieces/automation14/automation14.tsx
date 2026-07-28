"use client";

import { Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Automation14Props {
  headingLabel?: string;
  source?: string;
  current?: number;
  total?: number;
  currentLabel?: string;
  sampleKey?: string;
  sampleValue?: string;
  tone?: Tone;
  className?: string;
}

const tileClasses: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary",
  foreground: "bg-foreground/10 text-foreground",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
};

export const automation14Demo: Automation14Props = {
  headingLabel: "For each item",
  source: "items[]",
  current: 3,
  total: 28,
  currentLabel: "current",
  sampleKey: "item.email",
  sampleValue: "ada@beste.co",
  tone: "violet",
};

export function Automation14({
  headingLabel = "For each item",
  source = "items[]",
  current = 0,
  total = 1,
  currentLabel = "current",
  sampleKey,
  sampleValue,
  tone = "violet",
  className,
}: Automation14Props) {
  const pct = Math.min(100, (current / Math.max(1, total)) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-md",
              tileClasses[tone]
            )}
            aria-hidden="true"
          >
            <Repeat2 className="size-3.5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-card-foreground">
              {headingLabel}
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              {source}
            </span>
          </div>
          <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
            {current} / {total}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", barClasses[tone])}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
        {sampleKey && sampleValue && (
          <div className="flex items-center gap-1.5 rounded-sm bg-muted/40 px-2 py-1 font-mono text-xs">
            <span className="text-muted-foreground">{currentLabel}</span>
            <span className="text-card-foreground">·</span>
            <span className="truncate text-sky-600 dark:text-sky-400">
              {sampleValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
