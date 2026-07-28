"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface Legal29Props {
  title?: string;
  body?: string;
  severity?: "info" | "warning" | "critical";
  effectiveOn?: string;
  className?: string;
}

const severityConfig = {
  info: {
    border: "border-sky-500",
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    label: "Info",
  },
  warning: {
    border: "border-amber-500",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    label: "Warning",
  },
  critical: {
    border: "border-rose-500",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    label: "Critical",
  },
};

export const legal29Demo: Legal29Props = {
  title: "New data-export rule · EU",
  body: "Effective June 1, any export of biometric data outside the EU must undergo a transfer impact assessment.",
  severity: "warning",
  effectiveOn: "Effective Jun 1, 2026",
};

export function Legal29({
  title,
  body,
  severity = "info",
  effectiveOn,
  className,
}: Legal29Props) {
  const s = severityConfig[severity];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm",
          s.border
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale
              className="size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Regulatory update
            </span>
          </div>
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", s.badge)}>
            {s.label}
          </span>
        </div>
        {title && (
          <span className="text-sm font-semibold text-card-foreground">
            {title}
          </span>
        )}
        {body && (
          <p className="text-sm leading-snug text-card-foreground">{body}</p>
        )}
        {effectiveOn && (
          <span className="text-xs text-muted-foreground">{effectiveOn}</span>
        )}
      </div>
    </div>
  );
}
