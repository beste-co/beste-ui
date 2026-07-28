"use client";

import { RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload21Props {
  filename?: string;
  interruptedAt?: string;
  percent?: number;
  resumeFrom?: string;
  className?: string;
}

export const upload21Demo: Upload21Props = {
  filename: "design-archive.zip",
  interruptedAt: "Interrupted 4 minutes ago",
  percent: 42,
  resumeFrom: "Resume from 132 MB",
};

export function Upload21({
  filename,
  interruptedAt,
  percent = 0,
  resumeFrom,
  className,
}: Upload21Props) {
  const pct = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            {interruptedAt && (
              <span className="truncate text-xs">
                {interruptedAt}
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {pct}%
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-amber-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          {resumeFrom && (
            <span className="text-xs text-muted-foreground">{resumeFrom}</span>
          )}
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1 text-xs font-semibold text-background hover:opacity-90"
          >
            <RotateCw className="size-3" aria-hidden="true" />
            Resume upload
          </button>
        </div>
      </div>
    </div>
  );
}
