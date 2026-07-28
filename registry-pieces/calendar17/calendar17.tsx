"use client";

import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimezoneRow {
  city: string;
  zone: string;
  time: string;
  offset: string;
  isLocal?: boolean;
}

interface Calendar17Props {
  heading?: string;
  rows?: TimezoneRow[];
  className?: string;
}

export const calendar17Demo: Calendar17Props = {
  heading: "Meeting in multiple zones",
  rows: [
    {
      city: "Istanbul",
      zone: "Europe/Istanbul",
      time: "14:00",
      offset: "GMT+3",
      isLocal: true,
    },
    { city: "London", zone: "Europe/London", time: "12:00", offset: "GMT+1" },
    {
      city: "San Francisco",
      zone: "America/Los_Angeles",
      time: "04:00",
      offset: "GMT-7",
    },
    { city: "Tokyo", zone: "Asia/Tokyo", time: "20:00", offset: "GMT+9" },
  ],
};

export function Calendar17({
  heading,
  rows = [],
  className,
}: Calendar17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Globe2
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          {heading && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {heading}
            </span>
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {rows.map((r, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-3 py-1.5 text-xs",
                r.isLocal && "font-semibold"
              )}
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-card-foreground">
                  {r.city}
                  {r.isLocal && (
                    <span className="ml-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Local
                    </span>
                  )}
                </span>
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {r.zone}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm font-bold text-card-foreground">
                  {r.time}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {r.offset}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
