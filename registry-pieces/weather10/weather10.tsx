"use client";

import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type Severity = "advisory" | "watch" | "warning";

interface Weather10Props {
  severity?: Severity;
  title?: string;
  detail?: string;
  until?: string;
  className?: string;
}

const severityClasses: Record<Severity, string> = {
  advisory: "text-amber-600 dark:text-amber-400",
  watch: "text-orange-600 dark:text-orange-400",
  warning: "text-rose-600 dark:text-rose-400",
};

const severityLabel: Record<Severity, string> = {
  advisory: "Advisory",
  watch: "Watch",
  warning: "Warning",
};

export const weather10Demo: Weather10Props = {
  severity: "advisory",
  title: "Heat Advisory",
  detail: "Heat index up to 38°C this afternoon. Stay hydrated and avoid direct sun.",
  until: "Until 9:00 PM tonight",
};

export function Weather10({
  severity = "advisory",
  title,
  detail,
  until,
  className,
}: Weather10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <TriangleAlert
          className={cn("mt-0.5 size-5 shrink-0", severityClasses[severity])}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-card-foreground">
              {title}
            </span>
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                severityClasses[severity]
              )}
            >
              {severityLabel[severity]}
            </span>
          </div>
          {detail && (
            <p className="text-xs leading-snug text-muted-foreground">
              {detail}
            </p>
          )}
          {until && (
            <span className="text-xs text-muted-foreground">{until}</span>
          )}
        </div>
      </div>
    </div>
  );
}
