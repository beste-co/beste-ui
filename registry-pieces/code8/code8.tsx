"use client";

import { cn } from "@/lib/utils";

interface Code8Props {
  keys?: string[];
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const code8Demo: Code8Props = {
  keys: ["⌘", "K"],
  label: "Open command palette",
  bordered: false,
};

export function Code8({ keys = [], label, bordered = false, className }: Code8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        {label && (
          <span className="truncate text-sm text-card-foreground">{label}</span>
        )}
        <div className="flex shrink-0 items-center gap-1">
          {keys.map((key, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span
                  className="text-xs text-muted-foreground"
                  aria-hidden="true"
                >
                  +
                </span>
              )}
              <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-card-foreground shadow-sm">
                {key}
              </kbd>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
