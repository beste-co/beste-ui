"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser9Props {
  domain?: string;
  message?: string;
  className?: string;
}

export const browser9Demo: Browser9Props = {
  domain: "beste.co",
  message: "wants to send you notifications",
};

export function Browser9({
  domain = "example.com",
  message = "wants to send you notifications",
  className,
}: Browser9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
            <Bell className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-card-foreground">
              {domain}
            </span>
            <span className="text-xs leading-snug text-muted-foreground">
              {message}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-border bg-card px-3 py-1 text-xs font-medium text-card-foreground transition-colors hover:bg-muted"
          >
            Block
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
