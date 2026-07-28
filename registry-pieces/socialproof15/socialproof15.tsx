"use client";

import { cn } from "@/lib/utils";

interface Socialproof15Props {
  value?: string;
  label?: string;
  delta?: string;
  className?: string;
}

export const socialproof15Demo: Socialproof15Props = {
  value: "1.2M",
  label: "Downloads",
  delta: "+18% this month",
};

export function Socialproof15({
  value = "0",
  label,
  delta,
  className,
}: Socialproof15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums tracking-tight text-card-foreground">
            {value}
          </span>
          {label && (
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
          )}
        </div>
        {delta && (
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
