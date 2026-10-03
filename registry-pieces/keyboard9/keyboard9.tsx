"use client";

import { cn } from "@/lib/utils";

interface Keyboard9Props {
  keyLabel?: string;
  description?: string;
  enabled?: boolean;
  bordered?: boolean;
  className?: string;
}

export const keyboard9Demo: Keyboard9Props = {
  keyLabel: "Caps Lock",
  enabled: true,
  bordered: false,
};

export function Keyboard9({
  keyLabel = "Caps Lock",
  description,
  enabled = false,
  bordered = false,
  className,
}: Keyboard9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-lg bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <kbd
          className={cn(
            "relative flex h-10 min-w-16 items-center justify-start rounded-md border border-border border-b-2 bg-muted px-3 text-xs font-medium text-card-foreground"
          )}
        >
          <span
            className={cn(
              "mr-2 inline-block size-1.5 rounded-full transition-colors",
              enabled
                ? "bg-emerald-500 shadow-md shadow-emerald-500/60"
                : "bg-muted-foreground/40"
            )}
            aria-hidden="true"
          />
          {keyLabel}
        </kbd>
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              "text-xs font-semibold",
              enabled
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-muted-foreground"
            )}
          >
            {enabled ? "On" : "Off"}
          </span>
          {description && (
            <span className="truncate text-xs text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
