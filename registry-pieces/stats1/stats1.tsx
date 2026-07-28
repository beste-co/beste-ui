"use client";

import { cn } from "@/lib/utils";

interface Stats1Props {
  value?: string;
  label?: string;
  hint?: string;
  className?: string;
}

export const stats1Demo: Stats1Props = {
  value: "128K",
  label: "Active users",
  hint: "Across 42 countries",
};

export function Stats1({
  value,
  label,
  hint,
  className,
}: Stats1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        {value && (
          <span className="text-4xl font-bold tracking-tight tabular-nums text-card-foreground">
            {value}
          </span>
        )}
        {label && (
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        )}
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
