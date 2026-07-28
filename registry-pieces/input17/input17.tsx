"use client";

import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input17Props {
  label?: string;
  from?: string;
  to?: string;
  duration?: string;
  className?: string;
}

export const input17Demo: Input17Props = {
  label: "Reporting window",
  from: "Apr 01",
  to: "Apr 30",
  duration: "30 days",
};

export function Input17({
  label,
  from,
  to,
  duration,
  className,
}: Input17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center overflow-hidden rounded-md border border-border bg-card shadow-sm">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
            <Calendar
              className="size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate font-mono text-sm text-card-foreground">
              {from}
            </span>
          </div>
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
            <span className="truncate font-mono text-sm text-card-foreground">
              {to}
            </span>
          </div>
          {duration && (
            <span className="shrink-0 border-l border-border bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
              {duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
