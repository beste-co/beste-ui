"use client";

import { cn } from "@/lib/utils";

interface Form7Props {
  label?: string;
  value?: string;
  max?: number;
  count?: number;
  hint?: string;
  className?: string;
}

export const form7Demo: Form7Props = {
  label: "Launch announcement",
  value:
    "Beste v3 ships real-time collaboration, custom themes, and a brand new AI editor. Available to all workspaces starting next Tuesday.",
  max: 280,
  hint: "Posted to your workspace feed and email digest.",
};

export function Form7({
  label,
  value = "",
  max = 280,
  count,
  hint,
  className,
}: Form7Props) {
  const length = count ?? value.length;
  const ratio = max > 0 ? length / max : 0;
  const isNear = ratio >= 0.8;
  const isOver = ratio > 1;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex min-h-24 items-start rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <span className="flex-1 text-sm leading-snug text-card-foreground">
            {value}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {hint && (
            <span className="truncate text-xs text-muted-foreground">
              {hint}
            </span>
          )}
          <span
            className={cn(
              "shrink-0 whitespace-nowrap font-mono text-xs tabular-nums",
              isOver
                ? "text-rose-600 dark:text-rose-400"
                : isNear
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
            )}
          >
            {length} / {max}
          </span>
        </div>
      </div>
    </div>
  );
}
