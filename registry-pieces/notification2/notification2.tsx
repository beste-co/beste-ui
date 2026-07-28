"use client";

import { AlertTriangle, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Severity = "error" | "warning" | "info";

interface Notification2Props {
  title?: string;
  description?: string;
  severity?: Severity;
  dismissible?: boolean;
  className?: string;
}

const severityConfig: Record<
  Severity,
  { icon: typeof Info; bubble: string }
> = {
  error: {
    icon: TriangleAlert,
    bubble: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    bubble:
      "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  info: {
    icon: Info,
    bubble: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
  },
};

export const notification2Demo: Notification2Props = {
  title: "Your card was declined",
  description: "Update the payment method on file to retry the charge.",
  severity: "error",
  dismissible: true,
};

export function Notification2({
  title,
  description,
  severity = "info",
  dismissible = false,
  className,
}: Notification2Props) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-start gap-3 rounded-lg border border-border bg-card p-3 shadow-lg">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            config.bubble
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
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
        </div>
        {dismissible && (
          <button
            type="button"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
            aria-label="Dismiss"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
