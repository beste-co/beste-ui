"use client";

import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal20Props {
  title?: string;
  caseNo?: string;
  court?: string;
  judge?: string;
  date?: string;
  courtroom?: string;
  type?: string;
  bordered?: boolean;
  className?: string;
}

export const legal20Demo: Legal20Props = {
  title: "Summary judgment hearing",
  date: "Wed, May 6 · 10:30",
  courtroom: "Courtroom 18B",
  type: "In-person appearance",
  bordered: false,
};

export function Legal20({
  title,
  caseNo,
  court,
  judge,
  date,
  courtroom,
  type,
  bordered = false,
  className,
}: Legal20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <Landmark className="size-5 shrink-0 text-amber-600 dark:text-amber-300" aria-hidden="true" />
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {caseNo && (
              <span className="truncate text-xs text-muted-foreground">
                {caseNo}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-muted/60 p-2 text-xs">
          {date && (
            <span className="font-semibold tabular-nums text-card-foreground">
              {date}
            </span>
          )}
          {courtroom && (
            <span className="text-card-foreground">{courtroom}</span>
          )}
          {court && (
            <span className="text-muted-foreground">{court}</span>
          )}
          {judge && (
            <span className="text-muted-foreground">Before {judge}</span>
          )}
        </div>
        {type && (
          <span className="inline-flex items-center gap-1 self-start rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
            {type}
          </span>
        )}
      </div>
    </div>
  );
}
