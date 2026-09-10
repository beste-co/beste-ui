"use client";

import { Calendar, Clock, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Automation3Props {
  schedule?: string;
  cron?: string;
  nextRun?: string;
  nextRunPrefix?: string;
  timezone?: string;
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

export const automation3Demo: Automation3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Automation3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-600 dark:text-sky-400"
            aria-hidden="true"
          >
            <Repeat className="size-4" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              {schedule}
            </span>
            {cron && (
              <span className="truncate font-mono text-xs text-current/60">
                {cron}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-current/15 pt-2 text-xs text-current/60">
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
