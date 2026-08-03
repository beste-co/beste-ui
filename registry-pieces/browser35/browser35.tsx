"use client";

import { Check, ChevronLeft, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailRow {
  label: string;
  value: string;
}

interface Browser35Props {
  time?: string;
  title?: string;
  status?: string;
  headline?: string;
  rows?: DetailRow[];
  action?: string;
  className?: string;
}

export const browser35Demo: Browser35Props = {
  time: "09:41",
  title: "Appointment",
  status: "Confirmed",
  headline: "Wednesday, 14 May · 09:00",
  rows: [
    { label: "With", value: "Dr Amelia Frost" },
    { label: "Room", value: "Clinic 2, ground floor" },
    { label: "Bring", value: "Referral letter" },
  ],
  action: "Add to calendar",
};

export function Browser35({
  time,
  title,
  status,
  headline,
  rows = [],
  action,
  className,
}: Browser35Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="w-full max-w-60 overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-4 py-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{time}</span>
          <Wifi className="size-3 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <ChevronLeft className="size-4 text-muted-foreground" aria-hidden="true" />
          {title && <p className="text-sm font-semibold text-card-foreground">{title}</p>}
        </div>

        <div className="p-4">
          {status && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
              <Check className="size-3" aria-hidden="true" />
              {status}
            </span>
          )}
          {headline && (
            <p className="mt-2 text-sm font-medium leading-snug text-card-foreground">{headline}</p>
          )}

          {rows.length > 0 && (
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {rows.map((row, index) => (
                <div key={index} className="flex items-baseline justify-between gap-3">
                  <span className="shrink-0 text-xs text-muted-foreground">{row.label}</span>
                  <span className="truncate text-xs text-card-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {action && (
            <span className="mt-4 flex h-9 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
              {action}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
