"use client";

import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor14Props {
  prefix?: string;
  problem?: string;
  suffix?: string;
  message?: string;
  source?: string;
  className?: string;
}

export const editor14Demo: Editor14Props = {
  prefix: "const total = items.",
  problem: "reduce",
  suffix: "(sum, i) => sum + i.price);",
  message: "Expected 2 arguments, but got 1.",
  source: "ts(2554)",
};

export function Editor14({
  prefix = "",
  problem = "",
  suffix = "",
  message,
  source,
  className,
}: Editor14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        <div className="rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
          <span className="text-card-foreground">{prefix}</span>
          <span className="text-card-foreground underline decoration-rose-500 decoration-wavy underline-offset-4">
            {problem}
          </span>
          <span className="text-card-foreground">{suffix}</span>
        </div>
        <div className="flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-50 px-3 py-2 shadow-sm dark:bg-rose-950/60">
          <TriangleAlert
            className="mt-0.5 size-3.5 shrink-0 text-rose-600 dark:text-rose-400"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            {message && (
              <span className="text-xs font-medium leading-snug text-rose-700 dark:text-rose-200">
                {message}
              </span>
            )}
            {source && (
              <span className="font-mono text-xs text-rose-600/80 dark:text-rose-300/80">
                {source}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
