"use client";

import { FileCheck2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Education28Props {
  title?: string;
  dueLabel?: string;
  submitted?: number;
  total?: number;
  late?: number;
  missing?: number;
  className?: string;
}

export const education28Demo: Education28Props = {
  title: "Midterm essay",
  dueLabel: "Due Thu 24 Apr · 23:59",
  submitted: 142,
  total: 180,
  late: 8,
  missing: 30,
};

export function Education28({
  title,
  dueLabel,
  submitted = 0,
  total = 1,
  late = 0,
  missing = 0,
  className,
}: Education28Props) {
  const submittedPct = Math.round((submitted / Math.max(1, total)) * 100);

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
            <FileCheck2 className="size-4" aria-hidden="true" />
          </div>
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
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {submittedPct}%
          </span>
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
        <div className="grid grid-cols-3 gap-1 text-center text-xs">
          <div className="flex flex-col gap-0.5 rounded-md bg-emerald-500/10 p-2">
            <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {submitted}
            </span>
            <span className="text-xs text-muted-foreground">Submitted</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-amber-500/10 p-2">
            <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">
              {late}
            </span>
            <span className="text-xs text-muted-foreground">Late</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-rose-500/10 p-2">
            <span className="font-mono text-sm font-bold text-rose-700 dark:text-rose-300">
              {missing}
            </span>
            <span className="text-xs text-muted-foreground">Missing</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="size-3" aria-hidden="true" />
          {total} students in cohort
        </span>
      </div>
    </div>
  );
}
