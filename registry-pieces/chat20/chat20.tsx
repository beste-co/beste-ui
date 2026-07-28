"use client";

import { PhoneMissed } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat20Props {
  caller?: string;
  time?: string;
  className?: string;
}

export const chat20Demo: Chat20Props = {
  caller: "Ayşe Kaya",
  time: "09:42",
};

export function Chat20({
  caller = "Unknown",
  time,
  className,
}: Chat20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
          <PhoneMissed className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-card-foreground">
            Missed call
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {caller}
            {time && ` · ${time}`}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-semibold text-card-foreground transition-colors hover:bg-muted"
        >
          Call back
        </button>
      </div>
    </div>
  );
}
