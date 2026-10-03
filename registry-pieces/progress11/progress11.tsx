"use client";

import { HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

interface Progress11Props {
  used?: string;
  total?: string;
  progress?: number;
  label?: string;
  bordered?: boolean;
  className?: string;
}

export const progress11Demo: Progress11Props = {
  used: "64 GB",
  total: "200 GB",
  progress: 32,
  label: "Workspace storage",
  bordered: false,
};

export function Progress11({
  used = "0 GB",
  total = "0 GB",
  progress = 0,
  label,
  bordered = false,
  className,
}: Progress11Props) {
  const pct = Math.max(0, Math.min(100, progress));
  const fillClass =
    pct >= 90
      ? "bg-rose-500"
      : pct >= 70
        ? "bg-amber-500"
        : "bg-sky-500";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg bg-card px-3 py-3 shadow-sm", bordered && "border border-border")}>
        <HardDrive
          className="size-5 shrink-0 text-sky-600 dark:text-sky-400"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {label && (
            <span className="truncate text-xs font-semibold text-card-foreground">
              {label}
            </span>
          )}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", fillClass)}
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            <span className="font-semibold text-card-foreground">{used}</span>
            {" of "}
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
