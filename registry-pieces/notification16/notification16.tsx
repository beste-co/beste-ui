"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification16Props {
  tag?: string;
  title?: string;
  description?: string;
  action?: string;
  dismissible?: boolean;
  className?: string;
}

export const notification16Demo: Notification16Props = {
  tag: "Announcement",
  title: "Beste v3 is now in open beta",
  description: "Early access to the new editor, theming, and live previews.",
  action: "Try it out",
  dismissible: true,
};

export function Notification16({
  tag,
  title,
  description,
  action,
  dismissible = false,
  className,
}: Notification16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {(tag || title) && (
            <div className="flex min-w-0 items-center gap-2">
              {tag && (
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {tag}
                </span>
              )}
              {title && (
                <span className="truncate text-sm font-semibold text-card-foreground">
                  {title}
                </span>
              )}
            </div>
          )}
          {description && (
            <span className="truncate text-sm text-muted-foreground">
              {description}
            </span>
          )}
        </div>
        {action && (
          <button
            type="button"
            className="shrink-0 rounded-md bg-foreground px-3 py-1.5 text-sm font-semibold text-background hover:opacity-90"
          >
            {action}
          </button>
        )}
        {dismissible && (
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-card-foreground"
            aria-label="Dismiss"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
