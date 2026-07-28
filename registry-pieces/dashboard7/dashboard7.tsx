"use client";

import { Calendar, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Dashboard7Props {
  range?: string;
  compare?: string;
  segment?: string;
  className?: string;
}

export const dashboard7Demo: Dashboard7Props = {
  range: "Apr 1 – Apr 21",
  compare: "vs previous",
  segment: "All segments",
};

export function Dashboard7({
  range = "Last 30 days",
  compare,
  segment,
  className,
}: Dashboard7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-1.5 rounded-md border border-border bg-card p-1.5 shadow-sm">
        <button
          type="button"
          className="flex flex-1 items-center gap-1.5 rounded-sm bg-muted px-2 py-1 text-xs font-medium text-card-foreground"
        >
          <Calendar className="size-3" aria-hidden="true" />
          <span className="truncate">{range}</span>
          <ChevronDown
            className="ml-auto size-3 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
        {compare && (
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            {compare}
            <ChevronDown className="size-3" aria-hidden="true" />
          </button>
        )}
        {segment && (
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            aria-label="Segment filter"
          >
            <SlidersHorizontal className="size-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
