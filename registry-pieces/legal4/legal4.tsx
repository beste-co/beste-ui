"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Legal4Props {
  title?: string;
  disclosingParty?: string;
  receivingParty?: string;
  term?: string;
  jurisdiction?: string;
  confidentialLabel?: string;
  disclosingLabel?: string;
  receivingLabel?: string;
  termPrefix?: string;
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

export const legal4Demo: Legal4Props = {
  surface: "card",
  bordered: false,
  inverted: false,
  title: "Mutual NDA",
  disclosingParty: "Beste Technologies Inc.",
  receivingParty: "Kestrel Labs",
  term: "3 year term",
  disclosingLabel: "Disclosing",
  receivingLabel: "Receiving",
};

export function Legal4({
  title,
  disclosingParty,
  receivingParty,
  term,
  jurisdiction,
  confidentialLabel,
  disclosingLabel = "Disclosing",
  receivingLabel = "Receiving",
  termPrefix,
  surface = "card",
  bordered = false,
  inverted = false,
  className,
}: Legal4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2.5 rounded-xl p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
          <div className="flex flex-col">
            {title && (
              <span className="text-sm font-semibold">
                {title}
              </span>
            )}
            {confidentialLabel && (
              <span className="text-xs font-medium text-current/60">
                {confidentialLabel}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-md bg-current/10 p-2 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-current/60">{disclosingLabel}</span>
            <span className="truncate font-medium">
              {disclosingParty}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-current/60">{receivingLabel}</span>
            <span className="truncate font-medium">
              {receivingParty}
            </span>
          </div>
        </div>
        {(term || jurisdiction) && (
          <div className="flex items-center justify-between gap-2 text-xs text-current/60">
            {term && (
              <span>
                {termPrefix ? `${termPrefix} · ` : ""}
                {term}
              </span>
            )}
            {jurisdiction && <span>{jurisdiction}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
