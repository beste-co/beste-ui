"use client";

import { Check, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

const approveClasses: Record<Tone, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  foreground: "bg-foreground text-background hover:bg-current/90",
  violet: "bg-violet-500 text-white hover:bg-violet-600",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
  sky: "bg-sky-500 text-white hover:bg-sky-600",
  amber: "bg-amber-500 text-white hover:bg-amber-600",
};


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const automation17Demo: Automation17Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation17Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-1.5">
          <ShieldCheck
            className="size-3.5 text-amber-500"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-current/60">
            {waitingLabel}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-semibold"
            aria-hidden="true"
          >
            {initials ?? requestedBy.charAt(0)}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold">
              {action}
            </span>
            <span className="truncate text-xs text-current/60">
              {requestedByPrefix} {requestedBy}
              {ago ? ` · ${ago}` : ""}
            </span>
          </div>
          {amount && (
            <span className="shrink-0 font-mono text-sm font-semibold tabular-nums">
              {amount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-sm border border-current/15 bg-current/10 px-3 py-1.5 text-xs font-medium hover:bg-current/10"
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
