"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input15Props {
  label?: string;
  value?: string;
  className?: string;
}

export const input15Demo: Input15Props = {
  label: "Start date",
  value: "2026-04-23",
};

export function Input15({
  label,
  value,
  className,
}: Input15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
          <Calendar
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="flex-1 truncate font-mono text-sm text-card-foreground">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">▼</span>
        </div>
      </div>
    </div>
  );
}
