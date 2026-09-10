"use client";

import { Check, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

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
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


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

export const event2Demo: Event2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Event2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex min-w-0 flex-col">
          {event && (
            <span className="truncate text-sm font-semibold">
              {event}
            </span>
          )}
          {when && (
            <span className="truncate text-xs text-current/60">
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
                : "border-current/15 bg-current/10 hover:bg-current/10"
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
                : "border-current/15 bg-current/10 hover:bg-current/10"
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
                : "border-current/15 bg-current/10 hover:bg-current/10"
            )}
          >
            <X className="size-3" aria-hidden="true" />
            {noLabel}
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-current/15 pt-2 text-xs text-current/60">
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
