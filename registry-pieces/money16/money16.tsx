"use client";

import { cn } from "@/lib/utils";

interface Money16Props {
  label?: string;
  rate?: string;
  unit?: string;
  note?: string;
  className?: string;
}

export const money16Demo: Money16Props = {
  label: "High-yield savings",
  rate: "4.30%",
  unit: "APY",
  note: "Compounded daily, paid monthly",
};

export function Money16({
  label,
  rate = "0.00%",
  unit,
  note,
  className,
}: Money16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-64 flex-col gap-2 rounded-lg border border-border bg-card px-4 py-4 shadow-sm">
        {label && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground">
            {rate}
          </span>
          {unit && (
            <span className="text-base font-semibold text-muted-foreground">
              {unit}
            </span>
          )}
        </div>
        {note && <span className="text-sm text-muted-foreground">{note}</span>}
      </div>
    </div>
  );
}
