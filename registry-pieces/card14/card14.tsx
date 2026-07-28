"use client";

import { cn } from "@/lib/utils";

interface Card14Props {
  unitPrice?: string;
  unitLabel?: string;
  includedUnits?: string;
  included?: string;
  overage?: string;
  className?: string;
}

export const card14Demo: Card14Props = {
  unitPrice: "$0.004",
  unitLabel: "per request",
  includedUnits: "1M",
  included: "requests included monthly",
  overage: "$3.00 per 1M after",
};

export function Card14({
  unitPrice,
  unitLabel,
  includedUnits,
  included,
  overage,
  className,
}: Card14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Usage-based
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-3xl font-bold text-card-foreground">
            {unitPrice}
          </span>
          <span className="text-xs text-muted-foreground">{unitLabel}</span>
        </div>
        <div className="rounded-md bg-muted/60 p-2 text-xs">
          <span className="font-mono font-semibold text-card-foreground">
            {includedUnits}
          </span>
          <span className="text-muted-foreground"> {included}</span>
        </div>
        {overage && (
          <span className="text-xs text-muted-foreground">{overage}</span>
        )}
      </div>
    </div>
  );
}
