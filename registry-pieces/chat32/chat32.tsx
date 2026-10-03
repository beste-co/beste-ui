"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat32Props {
  message?: string;
  bordered?: boolean;
  className?: string;
}

export const chat32Demo: Chat32Props = {
  message: "Let's move the sync to 3pm instead.",
  bordered: false,
};

export function Chat32({
  message,
  bordered = false,
  className,
}: Chat32Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex max-w-72 flex-col items-end gap-1 ml-auto">
        <div className="rounded-2xl rounded-br-md bg-primary/30 px-3 py-2 text-sm leading-snug text-primary-foreground/70 line-through">
          {message}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Not delivered
          </span>
          <button
            type="button"
            className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium text-card-foreground transition-colors hover:bg-muted", bordered ? "border border-border bg-card" : "bg-card")}
          >
            Retry
          </button>
          <button
            type="button"
            aria-label="Delete"
            className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-rose-500"
          >
            <Trash2 className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
