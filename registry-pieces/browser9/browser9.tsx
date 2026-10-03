"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser9Props {
  domain?: string;
  message?: string;
  bordered?: boolean;
  className?: string;
}

export const browser9Demo: Browser9Props = {
  domain: "beste.co",
  message: "wants to send you notifications",
  bordered: false,
};

export function Browser9({
  domain = "example.com",
  message = "wants to send you notifications",
  bordered = false,
  className,
}: Browser9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-3 rounded-lg bg-card p-3 shadow-lg", bordered && "border border-border")}>
        <div className="flex items-start gap-3">
          <Bell
            className="mt-0.5 size-5 shrink-0 text-sky-600 dark:text-sky-400"
            aria-hidden="true"
          />
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
            className={cn("rounded-md px-3 py-1 text-xs font-medium text-card-foreground transition-colors hover:bg-muted", bordered ? "border border-border bg-card" : "bg-muted hover:bg-muted-foreground/15")}
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
