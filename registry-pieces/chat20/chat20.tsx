"use client";

import { PhoneMissed } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat20Props {
  caller?: string;
  time?: string;
  bordered?: boolean;
  className?: string;
}

export const chat20Demo: Chat20Props = {
  caller: "Ayşe Kaya",
  time: "09:42",
  bordered: false,
};

export function Chat20({
  caller = "Unknown",
  time,
  bordered = false,
  className,
}: Chat20Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-3 rounded-lg bg-card px-3 py-2.5 shadow-sm", bordered && "border border-border")}>
        <PhoneMissed
          className="size-5 shrink-0 text-rose-600 dark:text-rose-400"
          aria-hidden="true"
        />
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
          className={cn("shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold text-card-foreground transition-colors hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
        >
          Call back
        </button>
      </div>
    </div>
  );
}
