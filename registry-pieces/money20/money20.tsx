"use client";

import { cn } from "@/lib/utils";

interface Money20Props {
  label?: string;
  runway?: string;
  balanceLabel?: string;
  balance?: string;
  burnLabel?: string;
  burn?: string;
  className?: string;
}

export const money20Demo: Money20Props = {
  label: "Runway",
  runway: "14 months",
  balanceLabel: "Balance",
  balance: "$420k",
  burnLabel: "Monthly burn",
  burn: "$30k",
};

export function Money20({
  label,
  runway = "0 months",
  balanceLabel = "Balance",
  balance = "$0",
  burnLabel = "Monthly burn",
  burn = "$0",
  className,
}: Money20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm">
        {label && (
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        )}
        <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
          {runway}
        </span>
        <div className="flex items-stretch gap-3 border-t border-border pt-3">
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">
              {balanceLabel}
            </span>
            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {balance}
            </span>
          </div>
          <div className="w-px bg-border" aria-hidden="true" />
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{burnLabel}</span>
            <span className="text-sm font-semibold tabular-nums text-card-foreground">
              {burn}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
