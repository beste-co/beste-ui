"use client";

import { cn } from "@/lib/utils";

interface Education3Props {
  completed?: number;
  total?: number;
  label?: string;
  className?: string;
}

export const education3Demo: Education3Props = {
  completed: 14,
  total: 24,
  label: "React performance",
};

export function Education3({
  completed = 0,
  total = 1,
  label,
  className,
}: Education3Props) {
  const safeTotal = Math.max(1, total);
  const clamped = Math.max(0, Math.min(safeTotal, completed));
  const pct = Math.round((clamped / safeTotal) * 100);
  const circumference = 2 * Math.PI * 28;
  const dash = (pct / 100) * circumference;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="relative shrink-0">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="-rotate-90 text-emerald-500"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              strokeWidth="6"
              className="stroke-muted"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              stroke="currentColor"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-card-foreground">
            {pct}%
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {label && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {label}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {clamped} of {safeTotal} lessons completed
          </span>
          <span className="mt-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            On track
          </span>
        </div>
      </div>
    </div>
  );
}
