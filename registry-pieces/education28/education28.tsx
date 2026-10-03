"use client";

import { FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education28Props {
  title?: string;
  dueLabel?: string;
  submitted?: number;
  total?: number;
  late?: number;
  missing?: number;
  bordered?: boolean;
  className?: string;
}

export const education28Demo: Education28Props = {
  title: "Midterm essay",
  dueLabel: "Due Thu 24 Apr",
  submitted: 142,
  late: 8,
  missing: 30,
  bordered: false,
};

export function Education28({
  title,
  dueLabel,
  submitted = 0,
  total,
  late = 0,
  missing = 0,
  bordered = false,
  className,
}: Education28Props) {
  // Without an explicit total the three counts make up the cohort.
  const cohort = total ?? submitted + late + missing;
  const submittedPct = Math.round((submitted / Math.max(1, cohort)) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <FileCheck2 className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {dueLabel && (
              <span className="truncate text-xs text-muted-foreground">
                {dueLabel}
              </span>
            )}
          </div>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${submittedPct}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-1 text-center text-xs tabular-nums">
          <div className="flex flex-col gap-0.5 rounded-md bg-emerald-500/10 p-2">
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {submitted}
            </span>
            <span className="text-xs text-muted-foreground">Submitted</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-amber-500/10 p-2">
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
              {late}
            </span>
            <span className="text-xs text-muted-foreground">Late</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-rose-500/10 p-2">
            <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
              {missing}
            </span>
            <span className="text-xs text-muted-foreground">Missing</span>
          </div>
        </div>
        {total != null && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {total} students in cohort
          </span>
        )}
      </div>
    </div>
  );
}
