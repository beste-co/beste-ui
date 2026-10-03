"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input17Props {
  label?: string;
  from?: string;
  to?: string;
  duration?: string;
  bordered?: boolean;
  className?: string;
}

export const input17Demo: Input17Props = {
  label: "Reporting window",
  from: "Apr 01",
  to: "Apr 30",
  duration: "30 days",
  bordered: false,
};

export function Input17({
  label,
  from,
  to,
  duration,
  bordered = false,
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
        <div className={cn("flex items-center overflow-hidden rounded-md bg-card shadow-sm", bordered && "border border-border")}>
          <div className="flex min-w-0 flex-1 items-center px-3 py-2">
            <span className="truncate text-sm text-card-foreground">
              {from}
            </span>
          </div>
          <ArrowRight
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 items-center px-3 py-2">
            <span className="truncate text-sm text-card-foreground">
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
