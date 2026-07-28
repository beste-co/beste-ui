"use client";

import { Calendar, Landmark, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal20Props {
  title?: string;
  caseNo?: string;
  court?: string;
  judge?: string;
  date?: string;
  courtroom?: string;
  type?: string;
  className?: string;
}

export const legal20Demo: Legal20Props = {
  title: "Summary judgment hearing",
  caseNo: "1:26-cv-04182-ABR",
  court: "US District Court · SDNY",
  judge: "Hon. Alana B. Reyes",
  date: "Wed, May 6 · 10:30",
  courtroom: "Courtroom 18B",
  type: "In-person appearance",
};

export function Legal20({
  title,
  caseNo,
  court,
  judge,
  date,
  courtroom,
  type,
  className,
}: Legal20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Landmark className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold text-card-foreground">
                {title}
              </span>
            )}
            {caseNo && (
              <span className="truncate font-mono text-xs text-muted-foreground">
                {caseNo}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-muted/60 p-2 text-xs">
          {date && (
            <div className="flex items-center gap-1.5">
              <Calendar
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-semibold text-card-foreground">
                {date}
              </span>
            </div>
          )}
          {courtroom && (
            <div className="flex items-center gap-1.5">
              <MapPin
                className="size-3 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-card-foreground">{courtroom}</span>
            </div>
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
