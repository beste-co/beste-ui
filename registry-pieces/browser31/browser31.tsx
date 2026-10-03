"use client";

import { FileDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser31Props {
  filename?: string;
  received?: string;
  total?: string;
  percent?: number;
  bordered?: boolean;
  className?: string;
}

export const browser31Demo: Browser31Props = {
  filename: "auralis-press-kit.zip",
  received: "4.2 MB",
  total: "12 MB",
  percent: 35,
  bordered: false,
};

export function Browser31({
  filename = "download.zip",
  received,
  total,
  percent = 0,
  bordered = false,
  className,
}: Browser31Props) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg bg-card p-2.5 shadow-sm", bordered && "border border-border")}>
        <FileDown
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-sm font-medium text-card-foreground">
            {filename}
          </span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${clamped}%` }}
              aria-hidden="true"
            />
          </div>
          {received && total && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {received} of {total}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Cancel download"
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
