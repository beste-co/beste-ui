"use client";

import { FileText, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface Upload22Props {
  filename?: string;
  size?: string;
  modified?: string;
  className?: string;
}

export const upload22Demo: Upload22Props = {
  filename: "2026-msa-final.pdf",
  size: "2.1 MB",
  modified: "Edited 2 hours ago",
};

export function Upload22({
  filename,
  size,
  modified,
  className,
}: Upload22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {filename}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {size} · {modified}
          </span>
        </div>
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
          aria-label="More"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
