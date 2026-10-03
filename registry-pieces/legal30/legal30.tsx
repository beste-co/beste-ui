"use client";

import { Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal30Props {
  matter?: string;
  jurisdiction?: string;
  settlement?: string;
  feeShare?: string;
  status?: string;
  bordered?: boolean;
  className?: string;
}

export const legal30Demo: Legal30Props = {
  matter: "Doe v. Synapse Health",
  settlement: "$12.4M",
  status: "Court approval pending",
  bordered: false,
};

export function Legal30({
  matter,
  jurisdiction,
  settlement,
  feeShare,
  status,
  bordered = false,
  className,
}: Legal30Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Banknote className="size-5 shrink-0 text-emerald-500" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {matter && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {matter}
              </span>
            )}
            {jurisdiction && (
              <span className="truncate text-xs text-muted-foreground">
                {jurisdiction}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-baseline justify-between rounded-md bg-emerald-500/10 p-2">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Settlement
          </span>
          <span className="text-2xl font-bold tabular-nums text-card-foreground">
            {settlement}
          </span>
        </div>
        {(feeShare || status) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {feeShare && <span>{feeShare}</span>}
            {status && (
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                {status}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
