"use client";

import { cn } from "@/lib/utils";

interface Monitoring20Props {
  errors?: number;
  success?: number;
  className?: string;
}

export const monitoring20Demo: Monitoring20Props = {
  errors: 124,
  success: 876,
};

export function Monitoring20({
  errors = 0,
  success = 0,
  className,
}: Monitoring20Props) {
  const total = Math.max(1, errors + success);
  const errorPct = (errors / total) * 100;
  const successPct = 100 - errorPct;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-sm">
        <span className="shrink-0 text-xs font-semibold tabular-nums text-rose-700 dark:text-rose-400">
          {errorPct.toFixed(1)}%
        </span>
        <div
          className="flex h-2 flex-1 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <span
            className="bg-rose-500"
            style={{ width: `${errorPct}%` }}
          />
          <span
            className="bg-emerald-500"
            style={{ width: `${successPct}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
          {successPct.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
