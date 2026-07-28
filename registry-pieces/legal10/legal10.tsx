"use client";

import { Gavel } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal10Props {
  caseNo?: string;
  court?: string;
  plaintiff?: string;
  defendant?: string;
  filed?: string;
  nextHearing?: string;
  className?: string;
}

export const legal10Demo: Legal10Props = {
  caseNo: "1:26-cv-04182-ABR",
  court: "US District Court · SDNY",
  plaintiff: "Beste Technologies Inc.",
  defendant: "Kestrel Labs LLC",
  filed: "Filed Apr 12, 2026",
  nextHearing: "Hearing · May 6, 10:30",
};

export function Legal10({
  caseNo,
  court,
  plaintiff,
  defendant,
  filed,
  nextHearing,
  className,
}: Legal10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900">
            <Gavel className="size-4" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold text-card-foreground">
              {caseNo}
            </span>
            <span className="text-xs text-muted-foreground">{court}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/60 p-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Plaintiff</span>
            <span className="truncate font-semibold text-card-foreground">
              {plaintiff}
            </span>
          </div>
          <span className="rounded bg-card px-1.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground">
            v.
          </span>
          <div className="flex flex-col text-right">
            <span className="text-muted-foreground">Defendant</span>
            <span className="truncate font-semibold text-card-foreground">
              {defendant}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {filed && <span>{filed}</span>}
          {nextHearing && (
            <span className="font-semibold text-amber-700 dark:text-amber-300">
              {nextHearing}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
