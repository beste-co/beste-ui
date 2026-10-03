"use client";

import { FileText, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface Upload22Props {
  filename?: string;
  size?: string;
  modified?: string;
  bordered?: boolean;
  className?: string;
}

export const upload22Demo: Upload22Props = {
  filename: "2026-msa-final.pdf",
  size: "2.1 MB",
  bordered: false,
};

export function Upload22({
  filename,
  size,
  modified,
  bordered = false,
  className,
}: Upload22Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <FileText className="size-5 shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {filename}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {[size, modified].filter(Boolean).join(" · ")}
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
