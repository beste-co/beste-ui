"use client";

import { FileText, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Upload15Props {
  filename?: string;
  size?: string;
  error?: string;
  bordered?: boolean;
  className?: string;
}

export const upload15Demo: Upload15Props = {
  filename: "team-retreat.mov",
  size: "612 MB",
  error: "File exceeds 500 MB upload limit",
  bordered: false,
};

export function Upload15({
  filename,
  size,
  error,
  bordered = false,
  className,
}: Upload15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg bg-card p-3 shadow-sm", bordered && "border")}>
        <div className="flex items-center gap-2.5">
          <FileText className="size-5 shrink-0 text-rose-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            <span className="truncate text-xs text-muted-foreground tabular-nums">
              {size}
            </span>
          </div>
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
            aria-label="Remove"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
        {error && (
          <div className="rounded-md border border-rose-500 bg-card px-2 py-1.5 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
