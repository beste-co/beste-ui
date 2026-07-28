"use client";

import { AlertCircle, FileText, RotateCw, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Upload15Props {
  filename?: string;
  size?: string;
  error?: string;
  className?: string;
}

export const upload15Demo: Upload15Props = {
  filename: "team-retreat.mov",
  size: "612 MB",
  error: "File exceeds 500 MB upload limit",
};

export function Upload15({
  filename,
  size,
  error,
  className,
}: Upload15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-rose-500 text-white">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            <span className="truncate text-xs text-muted-foreground">
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
          <div className="flex items-start gap-2 rounded-md border border-rose-500 bg-card px-2 py-1.5 text-xs">
            <AlertCircle
              className="mt-0.5 size-3.5 shrink-0 text-rose-500"
              aria-hidden="true"
            />
            <span className="text-rose-700 dark:text-rose-300">{error}</span>
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90"
          >
            <RotateCw className="size-3" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
