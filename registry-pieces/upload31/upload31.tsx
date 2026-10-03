"use client";

import { ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload31Props {
  filename?: string;
  pages?: number;
  ocrConfidence?: number;
  language?: string;
  bordered?: boolean;
  className?: string;
}

export const upload31Demo: Upload31Props = {
  filename: "2026-invoice-batch.pdf",
  pages: 12,
  ocrConfidence: 96,
  bordered: false,
};

export function Upload31({
  filename,
  pages = 0,
  ocrConfidence = 0,
  language,
  bordered = false,
  className,
}: Upload31Props) {
  const pct = Math.max(0, Math.min(100, ocrConfidence));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <ScanLine className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {filename}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {pages} pages OCR'd
              {language ? ` · ${language}` : ""}
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
            {pct}% confident
          </span>
        </div>
        <div
          className="h-1 overflow-hidden rounded-full bg-muted"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
