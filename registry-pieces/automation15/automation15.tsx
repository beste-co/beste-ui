"use client";

import { AlertTriangle } from "lucide-react";
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
  bordered?: boolean;
  className?: string;
}

export const automation15Demo: Automation15Props = {
  failedLabel: "Run failed",
  retryLabel: "Retry",
  errorCode: "401 Unauthorized",
  message: "Gmail API returned an expired OAuth token.",
  bordered: false,
};

export function Automation15({
  failedLabel = "Run failed",
  runId,
  ago,
  retryLabel = "Retry",
  stepFieldLabel,
  stepLabel,
  errorFieldLabel,
  errorCode,
  message,
  bordered = false,
  className,
}: Automation15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md bg-card p-3 shadow-sm", bordered && "border border-rose-500/60")}>
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="size-4 shrink-0 text-rose-600 dark:text-rose-400"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {failedLabel}
            </span>
            {(runId || ago) && (
              <div className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
                {runId && (
                  <span className="truncate text-card-foreground">{runId}</span>
                )}
                {ago && <span>{runId ? `· ${ago}` : ago}</span>}
              </div>
            )}
          </div>
          <button
            type="button"
            className={cn("inline-flex shrink-0 cursor-pointer items-center rounded-sm px-2 py-1 text-xs font-medium text-card-foreground hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
          >
            {retryLabel}
          </button>
        </div>
        {(stepLabel || errorCode || message) && (
          <div className={cn("flex flex-col gap-0.5 rounded-sm px-2 py-1.5 text-xs", bordered ? "border border-border bg-card" : "bg-muted")}>
            {stepLabel && (
              <div className="flex items-baseline gap-1.5">
                {stepFieldLabel && (
                  <span className="text-muted-foreground">{stepFieldLabel}</span>
                )}
                <span className="text-card-foreground">{stepLabel}</span>
              </div>
            )}
            {errorCode && (
              <div className="flex items-baseline gap-1.5">
                {errorFieldLabel && (
                  <span className="text-muted-foreground">{errorFieldLabel}</span>
                )}
                <span className="text-rose-600 dark:text-rose-400">{errorCode}</span>
              </div>
            )}
            {message && (
              <span className="text-muted-foreground">{message}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
