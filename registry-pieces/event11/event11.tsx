"use client";

import { cn } from "@/lib/utils";

interface Event11Props {
  month?: string;
  day?: string;
  title?: string;
  meta?: string;
  action?: string;
  bordered?: boolean;
  className?: string;
}

export const event11Demo: Event11Props = {
  month: "May",
  day: "12",
  title: "Consultation · Joep Beving",
  meta: "09:00 – 09:45 · Room 2",
  action: "Join",
  bordered: false,
};

export function Event11({
  month,
  day,
  title,
  meta,
  action,
  bordered = false,
  className,
}: Event11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-4 rounded-md bg-card p-4 shadow-xl", bordered && "border border-border")}>
        <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-md bg-muted">
          {month && (
            <span className="text-xs text-muted-foreground">
              {month}
            </span>
          )}
          {day && (
            <span className="text-xl font-semibold leading-tight tabular-nums text-card-foreground">
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
          <span className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            {action}
          </span>
        )}
      </div>
    </div>
  );
}
