"use client";

import { cn } from "@/lib/utils";

interface Input29Props {
  label?: string;
  value?: string;
  bordered?: boolean;
  className?: string;
}

export const input29Demo: Input29Props = {
  label: "Invoice number",
  value: "INV-2026-00421",
  bordered: false,
};

export function Input29({
  label,
  value,
  bordered = false,
  className,
}: Input29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className={cn("flex items-center gap-2 rounded-md bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
          <span className="flex-1 truncate text-sm font-semibold tabular-nums text-card-foreground">
            {value}
          </span>
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            Auto
          </span>
        </div>
      </div>
    </div>
  );
}
