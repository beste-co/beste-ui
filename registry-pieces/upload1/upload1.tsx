"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload1Props {
  filename?: string;
  size?: string;
  progress?: number;
  className?: string;
}

export const upload1Demo: Upload1Props = {
  filename: "brand-guidelines.pdf",
  size: "12.4 MB",
  progress: 68,
};

export function Upload1({
  filename,
  size,
  progress = 0,
  className,
}: Upload1Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-60 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-medium text-card-foreground">
              {filename}
            </span>
            <span className="text-xs text-muted-foreground">
              {size} · {pct}%
            </span>
          </div>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-sky-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
