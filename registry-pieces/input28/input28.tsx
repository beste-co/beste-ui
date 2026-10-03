"use client";

import { cn } from "@/lib/utils";

interface Input28Props {
  pattern?: string;
  flags?: string;
  matches?: number;
  bordered?: boolean;
  className?: string;
}

export const input28Demo: Input28Props = {
  pattern: "^[a-z]+@beste\\.co$",
  flags: "gi",
  matches: 42,
  bordered: false,
};

export function Input28({
  pattern = "",
  flags = "",
  matches,
  bordered = false,
  className,
}: Input28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-2 rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="flex-1 truncate text-xs text-card-foreground">
          {pattern}
        </span>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs text-amber-600 dark:text-amber-400">
          {flags}
        </span>
        {typeof matches === "number" && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">
            {matches}
          </span>
        )}
      </div>
    </div>
  );
}
