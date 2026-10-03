"use client";

import { ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload26Props {
  current?: number;
  total?: number;
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const upload26Demo: Upload26Props = {
  current: 3,
  total: 5,
  label: "Scanning page",
  bordered: false,
};

export function Upload26({
  current = 0,
  total = 1,
  label = "Scanning page",
  bordered = false,
  className,
}: Upload26Props) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(1, total)) * 100));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-md bg-card p-2 shadow-sm", bordered && "border border-border")}>
        <ScanLine className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {label} · <span className="text-card-foreground">{current} / {total}</span>
            </span>
          </div>
          <div
            className="h-1 overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
