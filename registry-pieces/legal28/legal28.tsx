"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal28Props {
  title?: string;
  citation?: string;
  summary?: string;
  outcome?: string;
  className?: string;
}

export const legal28Demo: Legal28Props = {
  title: "Smith v. Beste Labs",
  citation: "42 F.4th 318 · 2d Cir. · 2023",
  summary:
    "Court affirmed dismissal where plaintiff failed to allege concrete harm under a state data-retention statute.",
  outcome: "Affirmed · 3-0",
};

export function Legal28({
  title,
  citation,
  summary,
  outcome,
  className,
}: Legal28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-sky-500/15 text-sky-500">
            <Bookmark className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {citation && (
              <span className="truncate font-mono text-xs text-muted-foreground">
                {citation}
              </span>
            )}
          </div>
          {outcome && (
            <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {outcome}
            </span>
          )}
        </div>
        {summary && (
          <p className="rounded-md bg-muted p-2 text-sm leading-snug text-card-foreground">
            {summary}
          </p>
        )}
      </div>
    </div>
  );
}
