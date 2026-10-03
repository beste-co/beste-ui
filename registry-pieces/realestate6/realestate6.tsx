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
  bordered?: boolean;
  className?: string;
}

const iconClasses: Record<Tone, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  sky: "text-sky-500",
  emerald: "text-emerald-500",
  violet: "text-violet-500",
  amber: "text-amber-500",
  rose: "text-rose-500",
};

export const realestate6Demo: Realestate6Props = {
  title: "Lease · 221B Riverside Ave #3",
  rent: "$3,400 / mo",
  deposit: "$3,400 deposit",
  tenantName: "Ólafur Arnalds",
  tone: "primary",
  bordered: false,
};

export function Realestate6({
  title,
  rent,
  deposit,
  leaseStart,
  tenantName,
  tone = "primary",
  bordered = false,
  className,
}: Realestate6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Key
            className={cn("size-5 shrink-0", iconClasses[tone])}
            aria-hidden="true"
          />
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
          <span className="text-xl font-bold tabular-nums text-card-foreground">
            {rent}
          </span>
        </div>
        {(deposit || leaseStart) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {deposit && <span>{deposit}</span>}
            {leaseStart && <span className="text-right">{leaseStart}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
