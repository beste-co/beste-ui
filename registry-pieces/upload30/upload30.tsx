"use client";

import { FileArchive } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload30Props {
  filename?: string;
  totalSize?: string;
  files?: number;
  savings?: string;
  filesLabel?: string;
  downloadLabel?: string;
  className?: string;
}

export const upload30Demo: Upload30Props = {
  filename: "project-handoff.zip",
  totalSize: "248 MB",
  files: 42,
  savings: "Compressed from 612 MB · 59% smaller",
  filesLabel: "files",
  downloadLabel: "Download",
};

export function Upload30({
  filename,
  totalSize,
  files = 0,
  savings,
  filesLabel = "files",
  downloadLabel = "Download",
  className,
}: Upload30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
          <FileArchive className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {filename && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {files} {filesLabel} · {totalSize}
          </span>
          {savings && (
            <span className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {savings}
            </span>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background hover:opacity-90"
        >
          {downloadLabel}
        </button>
      </div>
    </div>
  );
}
