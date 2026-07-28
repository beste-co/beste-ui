"use client";

import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat23Props {
  message?: string;
  sendAt?: string;
  className?: string;
}

export const chat23Demo: Chat23Props = {
  message: "Reminder: Q2 planning notes due by noon tomorrow.",
  sendAt: "Tomorrow · 08:00",
};

export function Chat23({
  message,
  sendAt = "Later",
  className,
}: Chat23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex max-w-64 flex-col gap-1.5 ml-auto items-end">
        <div className="rounded-2xl rounded-br-md border border-dashed border-primary/60 bg-primary/5 px-3 py-2 text-sm leading-snug text-card-foreground">
          {message}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <Clock className="size-3" aria-hidden="true" />
          <span>Sends {sendAt}</span>
          <button
            type="button"
            aria-label="Cancel scheduled"
            className="ml-1 flex size-4 items-center justify-center rounded-full transition-colors hover:bg-card"
          >
            <X className="size-2.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
