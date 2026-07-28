"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export const legal4Demo: Legal4Props = {
  title: "Mutual NDA",
  disclosingParty: "Beste Technologies Inc.",
  receivingParty: "Kestrel Labs",
  term: "3 years from the effective date",
  jurisdiction: "Delaware, USA",
  confidentialLabel: "Confidential",
  disclosingLabel: "Disclosing",
  receivingLabel: "Receiving",
  termPrefix: "Term",
};

export function Legal4({
  title,
  disclosingParty,
  receivingParty,
  term,
  jurisdiction,
  confidentialLabel = "Confidential",
  disclosingLabel = "Disclosing",
  receivingLabel = "Receiving",
  termPrefix = "Term",
  className,
}: Legal4Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2.5 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900">
            <ShieldCheck className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            {title && (
              <span className="text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {confidentialLabel}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-md bg-muted p-2 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{disclosingLabel}</span>
            <span className="truncate font-medium text-card-foreground">
              {disclosingParty}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{receivingLabel}</span>
            <span className="truncate font-medium text-card-foreground">
              {receivingParty}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
          {term && (
            <span className="text-muted-foreground">
              {termPrefix} ·{" "}
              <span className="text-card-foreground">{term}</span>
            </span>
          )}
          {jurisdiction && (
            <span className="text-muted-foreground">{jurisdiction}</span>
          )}
        </div>
      </div>
    </div>
  );
}
