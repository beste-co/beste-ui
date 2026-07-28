"use client";

import { Calendar, Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation3Props {
  schedule?: string;
  cron?: string;
  nextRun?: string;
  nextRunPrefix?: string;
  timezone?: string;
  className?: string;
}

export const automation3Demo: Automation3Props = {
  schedule: "Every Monday at 9:00 AM",
  cron: "0 9 * * 1",
  nextRun: "in 2 days, 14h",
  nextRunPrefix: "Next run",
  timezone: "Europe/Istanbul",
};

export function Automation3({
  schedule = "Every day",
  cron,
  nextRun,
  nextRunPrefix = "Next run",
  timezone,
  className,
}: Automation3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-600 dark:text-sky-400"
            aria-hidden="true"
          >
            <Repeat className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {schedule}
            </span>
            {cron && (
              <span className="truncate font-mono text-xs text-muted-foreground">
                {cron}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          {nextRun && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" />
              <span>
                {nextRunPrefix} {nextRun}
              </span>
            </span>
          )}
          {timezone && (
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="size-3" aria-hidden="true" />
              {timezone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
