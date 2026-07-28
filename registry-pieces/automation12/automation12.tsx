"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation12Props {
  status?: "success" | "failed";
  runLabel?: string;
  statusCode?: string;
  duration?: string;
  body?: string;
  className?: string;
}

export const automation12Demo: Automation12Props = {
  status: "success",
  runLabel: "Test run",
  statusCode: "200 OK",
  duration: "142 ms",
  body: `{
  "id": "evt_8a2k4f",
  "type": "payment.succeeded",
  "amount": 4200,
  "currency": "usd"
}`,
};

export function Automation12({
  status = "success",
  runLabel = "Test run",
  statusCode = "200 OK",
  duration,
  body = "{}",
  className,
}: Automation12Props) {
  const success = status === "success";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full",
                success
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
              )}
              aria-hidden="true"
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className="text-xs font-semibold text-card-foreground">
              {runLabel}
            </span>
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                success
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              )}
            >
              {statusCode}
            </span>
          </div>
          {duration && (
            <span className="font-mono text-xs text-muted-foreground">
              {duration}
            </span>
          )}
        </div>
        <pre className="max-h-28 overflow-hidden whitespace-pre bg-muted/40 px-3 py-2 font-mono text-xs leading-relaxed text-card-foreground">
          {body}
        </pre>
      </div>
    </div>
  );
}
