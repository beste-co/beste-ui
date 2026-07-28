"use client";

import { cn } from "@/lib/utils";

interface Ai5Props {
  used?: number;
  total?: number;
  label?: string;
  className?: string;
}

export const ai5Demo: Ai5Props = {
  used: 4820,
  total: 8192,
  label: "Tokens",
};

export function Ai5({
  used = 0,
  total = 1,
  label = "Tokens",
  className,
}: Ai5Props) {
  const pct = Math.max(0, Math.min(100, (used / Math.max(1, total)) * 100));
  const fill =
    pct >= 85
      ? "bg-rose-500"
      : pct >= 60
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-1.5 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-xs tabular-nums text-card-foreground">
            <span className="font-semibold">
              {used.toLocaleString()}
            </span>
            {" / "}
            {total.toLocaleString()}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", fill)}
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
