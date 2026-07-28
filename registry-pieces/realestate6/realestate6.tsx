"use client";

import { Key } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Realestate6Props {
  title?: string;
  rent?: string;
  deposit?: string;
  leaseStart?: string;
  tenantName?: string;
  tone?: Tone;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground",
  foreground: "bg-foreground text-background",
  sky: "bg-sky-500 text-white",
  emerald: "bg-emerald-500 text-white",
  violet: "bg-violet-500 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-500 text-white",
};

export const realestate6Demo: Realestate6Props = {
  title: "Lease · 221B Riverside Ave #3",
  rent: "$3,400 / mo",
  deposit: "$3,400 deposit",
  leaseStart: "Starts Jun 1, 2026 · 12-month term",
  tenantName: "Tenant · Beste Sözen",
  tone: "primary",
};

export function Realestate6({
  title,
  rent,
  deposit,
  leaseStart,
  tenantName,
  tone = "primary",
  className,
}: Realestate6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-md",
              iconClasses[tone]
            )}
          >
            <Key className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {tenantName && (
              <span className="truncate text-sm text-muted-foreground">
                {tenantName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-baseline justify-between rounded-md bg-muted p-2">
          <span className="text-sm text-muted-foreground">Monthly</span>
          <span className="font-mono text-xl font-bold text-card-foreground">
            {rent}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {deposit && <span>{deposit}</span>}
          {leaseStart && <span className="text-right">{leaseStart}</span>}
        </div>
      </div>
    </div>
  );
}
