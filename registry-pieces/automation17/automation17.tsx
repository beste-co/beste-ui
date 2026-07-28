"use client";

import { Check, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "violet"
  | "emerald"
  | "sky"
  | "amber";

interface Automation17Props {
  waitingLabel?: string;
  requestedBy?: string;
  requestedByPrefix?: string;
  initials?: string;
  ago?: string;
  action?: string;
  amount?: string;
  denyLabel?: string;
  approveLabel?: string;
  tone?: Tone;
  className?: string;
}

const approveClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-foreground/90",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
};

export const automation17Demo: Automation17Props = {
  waitingLabel: "Waiting for approval",
  requestedBy: "Ada Lovelace",
  requestedByPrefix: "Requested by",
  initials: "AL",
  ago: "3m ago",
  action: "Send refund to Atlas Labs",
  amount: "$2,840.00",
  denyLabel: "Deny",
  approveLabel: "Approve",
  tone: "emerald",
};

export function Automation17({
  waitingLabel = "Waiting for approval",
  requestedBy = "Requester",
  requestedByPrefix = "Requested by",
  initials,
  ago,
  action = "Action",
  amount,
  denyLabel = "Deny",
  approveLabel = "Approve",
  tone = "emerald",
  className,
}: Automation17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <ShieldCheck
            className="size-3.5 text-amber-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {waitingLabel}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-card-foreground"
            aria-hidden="true"
          >
            {initials ?? requestedBy.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold text-card-foreground">
              {action}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {requestedByPrefix} {requestedBy}
              {ago ? ` · ${ago}` : ""}
            </span>
          </div>
          {amount && (
            <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-card-foreground">
              {amount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-sm border border-border bg-card px-3 py-1.5 text-xs font-medium text-card-foreground hover:bg-muted"
          >
            <X className="size-3" aria-hidden="true" />
            {denyLabel}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1 rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors",
              approveClasses[tone]
            )}
          >
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            {approveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
