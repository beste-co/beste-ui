"use client";

import { CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload14Props {
  filename?: string;
  size?: string;
  ago?: string;
  className?: string;
}

export const upload14Demo: Upload14Props = {
  filename: "Q2-forecast-final.xlsx",
  size: "2.1 MB",
  ago: "Uploaded 2 seconds ago",
};

export function Upload14({
  filename,
  size,
  ago,
  className,
}: Upload14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-3 rounded-lg border border-emerald-500 bg-card p-3 shadow-sm">
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white">
          <FileText className="size-4" aria-hidden="true" />
          <CheckCircle2
            className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-card bg-emerald-500 text-white"
            aria-hidden="true"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            {filename}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {size} · {ago}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white hover:opacity-90"
        >
          Open
        </button>
      </div>
    </div>
  );
}
