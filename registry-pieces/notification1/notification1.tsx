"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification1Props {
  title?: string;
  description?: string;
  action?: string;
  className?: string;
}

export const notification1Demo: Notification1Props = {
  title: "Payment successful",
  description: "Your invoice has been sent to billing@beste.co",
  action: "View receipt →",
};

export function Notification1({
  title,
  description,
  action,
  className,
}: Notification1Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {title && (
            <span className="text-sm font-semibold text-card-foreground">
              {title}
            </span>
          )}
          {description && (
            <span className="text-xs leading-snug text-muted-foreground">
              {description}
            </span>
          )}
          {action && (
            <button
              type="button"
              className="mt-1 self-start text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
