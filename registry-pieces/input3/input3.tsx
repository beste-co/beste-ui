"use client";

import { cn } from "@/lib/utils";

interface Input3Props {
  label?: string;
  description?: string;
  enabled?: boolean;
  className?: string;
}

export const input3Demo: Input3Props = {
  label: "Email notifications",
  description: "Get updates when teammates comment",
  enabled: true,
};

export function Input3({
  label,
  description,
  enabled = false,
  className,
}: Input3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col">
          {label && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {label}
            </span>
          )}
          {description && (
            <span className="truncate text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={label}
          className={cn(
            "relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
            enabled ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "size-4 rounded-full bg-white shadow-sm transition-transform",
              enabled ? "translate-x-4" : "translate-x-0"
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
