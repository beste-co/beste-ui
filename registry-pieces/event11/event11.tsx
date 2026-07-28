"use client";

import { Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event11Props {
  month?: string;
  day?: string;
  title?: string;
  meta?: string;
  action?: string;
  className?: string;
}

export const event11Demo: Event11Props = {
  month: "May",
  day: "12",
  title: "Consultation · Rowan Blake",
  meta: "09:00 – 09:45 · Room 2",
  action: "Join",
};

export function Event11({
  month,
  day,
  title,
  meta,
  action,
  className,
}: Event11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-4 rounded-md border border-border bg-card p-4 shadow-xl">
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-md bg-muted">
          {month && (
            <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {month}
            </span>
          )}
          {day && (
            <span className="text-xl font-semibold leading-tight text-card-foreground">
              {day}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {title && (
            <p className="truncate text-sm font-semibold text-card-foreground">
              {title}
            </p>
          )}
          {meta && (
            <p className="truncate text-sm text-muted-foreground">{meta}</p>
          )}
        </div>

        {action && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            <Video className="size-3.5" aria-hidden="true" />
            {action}
          </span>
        )}
      </div>
    </div>
  );
}
