"use client";

import { Check, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Response = "going" | "maybe" | "no" | "unset";

interface Event2Props {
  event?: string;
  when?: string;
  response?: Response;
  going?: number;
  maybe?: number;
  goingLabel?: string;
  maybeLabel?: string;
  noLabel?: string;
  goingSuffix?: string;
  maybeSuffix?: string;
  className?: string;
}

export const event2Demo: Event2Props = {
  event: "Team offsite · Bodrum",
  when: "May 12 – 15",
  response: "going",
  going: 28,
  maybe: 4,
  goingLabel: "Going",
  maybeLabel: "Maybe",
  noLabel: "No",
  goingSuffix: "going",
  maybeSuffix: "maybe",
};

export function Event2({
  event,
  when,
  response = "unset",
  going = 0,
  maybe = 0,
  goingLabel = "Going",
  maybeLabel = "Maybe",
  noLabel = "No",
  goingSuffix = "going",
  maybeSuffix = "maybe",
  className,
}: Event2Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex min-w-0 flex-col">
          {event && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {event}
            </span>
          )}
          {when && (
            <span className="truncate text-xs text-muted-foreground">
              {when}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition-colors",
              response === "going"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-border bg-card text-card-foreground hover:bg-muted"
            )}
          >
            <Check className="size-3" aria-hidden="true" />
            {goingLabel}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition-colors",
              response === "maybe"
                ? "border-amber-500 bg-amber-500 text-white"
                : "border-border bg-card text-card-foreground hover:bg-muted"
            )}
          >
            <HelpCircle className="size-3" aria-hidden="true" />
            {maybeLabel}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition-colors",
              response === "no"
                ? "border-rose-500 bg-rose-500 text-white"
                : "border-border bg-card text-card-foreground hover:bg-muted"
            )}
          >
            <X className="size-3" aria-hidden="true" />
            {noLabel}
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span
              className="size-1.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {going} {goingSuffix}
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className="size-1.5 rounded-full bg-amber-500"
              aria-hidden="true"
            />
            {maybe} {maybeSuffix}
          </span>
        </div>
      </div>
    </div>
  );
}
