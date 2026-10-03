"use client";

import { FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser11Props {
  filename?: string;
  progress?: number;
  eta?: string;
  bordered?: boolean;
  className?: string;
}

export const browser11Demo: Browser11Props = {
  filename: "beste-ui-blocks.zip",
  progress: 42,
  bordered: false,
};

export function Browser11({
  filename = "download.zip",
  progress = 0,
  eta,
  bordered = false,
  className,
}: Browser11Props) {
  const pct = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-2.5 rounded-full bg-card px-3 py-2 shadow-md", bordered && "border border-border")}>
        <FileDown
          className="size-5 shrink-0 text-sky-600 dark:text-sky-400"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-xs font-semibold text-card-foreground">
              {filename}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {pct}%
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-sky-500 transition-all"
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
        {eta && (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {eta}
          </span>
        )}
      </div>
    </div>
  );
}
