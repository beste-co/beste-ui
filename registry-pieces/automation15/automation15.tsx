"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation15Props {
  failedLabel?: string;
  runId?: string;
  ago?: string;
  retryLabel?: string;
  stepFieldLabel?: string;
  stepLabel?: string;
  errorFieldLabel?: string;
  errorCode?: string;
  message?: string;
  className?: string;
}

export const automation15Demo: Automation15Props = {
  failedLabel: "Run failed",
  runId: "run_8a2k",
  ago: "3m ago",
  retryLabel: "Retry",
  stepFieldLabel: "step",
  stepLabel: "Send email",
  errorFieldLabel: "error",
  errorCode: "401 Unauthorized",
  message: "Gmail API returned an expired OAuth token.",
};

export function Automation15({
  failedLabel = "Run failed",
  runId = "run_000",
  ago,
  retryLabel = "Retry",
  stepFieldLabel = "step",
  stepLabel,
  errorFieldLabel = "error",
  errorCode,
  message,
  className,
}: Automation15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-rose-500/60 bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400"
            aria-hidden="true"
          >
            <AlertTriangle className="size-3.5" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {failedLabel}
            </span>
            <div className="flex items-baseline gap-1.5 font-mono text-xs text-muted-foreground">
              <span className="truncate text-card-foreground">{runId}</span>
              {ago && <span>· {ago}</span>}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 text-xs font-medium text-card-foreground hover:bg-muted"
          >
            <RotateCw className="size-3" aria-hidden="true" />
            {retryLabel}
          </button>
        </div>
        <div className="flex flex-col gap-0.5 rounded-sm border border-border bg-card px-2 py-1.5 font-mono text-xs">
          <div className="flex items-baseline gap-1.5">
            <span className="text-muted-foreground">{stepFieldLabel}</span>
            <span className="text-card-foreground">{stepLabel}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-muted-foreground">{errorFieldLabel}</span>
            <span className="text-rose-600 dark:text-rose-400">{errorCode}</span>
          </div>
          {message && (
            <span className="text-muted-foreground">{message}</span>
          )}
        </div>
      </div>
    </div>
  );
}
