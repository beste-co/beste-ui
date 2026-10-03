"use client";

import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Calendar23Props {
  holidayName?: string;
  country?: string;
  date?: string;
  type?: string;
  bordered?: boolean;
  className?: string;
}

export const calendar23Demo: Calendar23Props = {
  holidayName: "Republic Day",
  country: "Türkiye",
  date: "Wed, Oct 29",
  bordered: false,
};

export function Calendar23({
  holidayName,
  country,
  date,
  type,
  bordered = false,
  className,
}: Calendar23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-xl bg-gradient-to-br from-rose-500/15 via-transparent to-transparent p-3 shadow-sm", bordered && "border border-border")}>
        <BookOpen className="size-5 shrink-0 text-rose-500" aria-hidden="true" />
        <div className="flex min-w-0 flex-1 flex-col">
          {holidayName && (
            <span className="truncate text-sm font-semibold text-card-foreground">
              {holidayName}
            </span>
          )}
          {country && (
            <span className="truncate text-xs text-muted-foreground">
              {country}
            </span>
          )}
          {type && (
            <span className="truncate text-xs italic text-muted-foreground">
              {type}
            </span>
          )}
        </div>
        {date && (
          <span className="shrink-0 rounded-md bg-card px-2 py-1 text-xs font-semibold text-card-foreground shadow-sm">
            {date}
          </span>
        )}
      </div>
    </div>
  );
}
