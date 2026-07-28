"use client";

import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card18Props {
  plan?: string;
  amount?: string;
  period?: string;
  renews?: string;
  usage?: number;
  usageLabel?: string;
  className?: string;
}

export const card18Demo: Card18Props = {
  plan: "Growth · Annual",
  amount: "$480",
  period: "/ year",
  renews: "Renews on May 1, 2026",
  usage: 64,
  usageLabel: "160 GB of 250 GB used",
};

export function Card18({
  plan,
  amount,
  period = "/ mo",
  renews,
  usage = 0,
  usageLabel,
  className,
}: Card18Props) {
  const pct = Math.max(0, Math.min(100, usage));

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-sky-500/15 text-sky-500">
            <CreditCard className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {plan}
            </span>
            {renews && (
              <span className="truncate text-xs text-muted-foreground">
                {renews}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-lg font-bold text-card-foreground">
              {amount}
            </span>
            <span className="text-xs text-muted-foreground">{period}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {usageLabel && (
            <span className="text-xs text-muted-foreground">{usageLabel}</span>
          )}
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-sky-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-card-foreground hover:bg-muted"
          >
            Manage plan
          </button>
          <button
            type="button"
            className="flex-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
