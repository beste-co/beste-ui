"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Legal1Props {
  title?: string;
  reference?: string;
  party1?: string;
  party2?: string;
  effectiveDate?: string;
  status?: string;
  party1Label?: string;
  party2Label?: string;
  effectiveLabel?: string;
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

export const legal1Demo: Legal1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Master services agreement",
  reference: "MSA-2026-0421",
  party1: "Beste Technologies Inc.",
  party2: "Beste Design Studio",
  effectiveDate: "May 1, 2026",
  status: "Awaiting counter-signature",
  party1Label: "Party A",
  party2Label: "Party B",
  effectiveLabel: "Effective",
};

export function Legal1({
  title,
  reference,
  party1,
  party2,
  effectiveDate,
  status,
  party1Label = "Party A",
  party2Label = "Party B",
  effectiveLabel = "Effective",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Legal1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2.5 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-start gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold">
                {title}
              </span>
            )}
            {reference && (
              <span className="truncate font-mono text-xs text-current/60">
                {reference}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-current/15 pt-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-current/60">{party1Label}</span>
            <span className="truncate">{party1}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-current/60">{party2Label}</span>
            <span className="truncate">{party2}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-current/60">{effectiveLabel}</span>
            <span className="">{effectiveDate}</span>
          </div>
        </div>
        {status && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <span
              className="size-1.5 rounded-full bg-amber-500"
              aria-hidden="true"
            />
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
