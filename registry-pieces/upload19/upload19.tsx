"use client";

import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber";

interface Upload19Props {
  total?: number;
  uploading?: number;
  done?: number;
  overallPercent?: number;
  speed?: string;
  tone?: Tone;
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
};

const barClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
};

const spinnerClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-600 dark:text-sky-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  violet: "text-violet-600 dark:text-violet-400",
  amber: "text-amber-600 dark:text-amber-400",
};

export const upload19Demo: Upload19Props = {
  total: 24,
  uploading: 3,
  done: 18,
  overallPercent: 74,
  tone: "primary",
  bordered: false,
};

export function Upload19({
  total = 0,
  uploading = 0,
  done = 0,
  overallPercent = 0,
  speed,
  tone = "primary",
  bordered = false,
  className,
}: Upload19Props) {
  const pct = Math.max(0, Math.min(100, overallPercent));
  const queued = Math.max(0, total - done - uploading);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <ListChecks
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              Uploading {total} files
            </span>
            {speed && (
              <span className="text-xs text-muted-foreground">{speed}</span>
            )}
          </div>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-card-foreground">
            {pct}%
          </span>
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
        <div className="grid grid-cols-3 gap-1 rounded-md bg-muted/60 p-2 text-center text-xs tabular-nums">
          <div className="flex flex-col">
            <span className="text-emerald-600 dark:text-emerald-400">
              {done}
            </span>
            <span className="text-muted-foreground">Done</span>
          </div>
          <div className="flex flex-col">
            <span className={spinnerClasses[tone]}>{uploading}</span>
            <span className="text-muted-foreground">Uploading</span>
          </div>
          <div className="flex flex-col">
            <span className="text-card-foreground">{queued}</span>
            <span className="text-muted-foreground">Queued</span>
          </div>
        </div>
      </div>
    </div>
  );
}
