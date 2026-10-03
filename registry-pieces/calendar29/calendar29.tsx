"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Calendar29Props {
  month?: string;
  today?: number;
  weekday?: string;
  bordered?: boolean;
  className?: string;
}

export const calendar29Demo: Calendar29Props = {
  month: "May",
  today: 12,
  weekday: "Monday",
  bordered: false,
};

export function Calendar29({
  month,
  today,
  weekday,
  bordered = false,
  className,
}: Calendar29Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-64 items-center gap-3 rounded-full bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
          {typeof today === "number" && (
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {today}
            </span>
          )}
          {month && (
            <span className="text-xs font-semibold text-muted-foreground">
              {month}
            </span>
          )}
          {weekday && (
            <span className="truncate text-xs text-muted-foreground">
              · {weekday}
            </span>
          )}
        </div>
        <button
          type="button"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90"
          aria-label="New event"
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
