"use client";

import { cn } from "@/lib/utils";

interface TimezoneRow {
  city: string;
  zone?: string;
  time: string;
  offset?: string;
  isLocal?: boolean;
}

interface Calendar17Props {
  heading?: string;
  rows?: TimezoneRow[];
  bordered?: boolean;
  className?: string;
}

export const calendar17Demo: Calendar17Props = {
  heading: "Meeting time",
  rows: [
    { city: "Istanbul", time: "14:00", isLocal: true },
    { city: "London", time: "12:00" },
    { city: "Tokyo", time: "20:00" },
  ],
  bordered: false,
};

export function Calendar17({
  heading,
  rows = [],
  bordered = false,
  className,
}: Calendar17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {heading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {heading}
          </span>
        )}
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
                {r.zone && (
                  <span className="truncate text-xs text-muted-foreground">
                    {r.zone}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold tabular-nums text-card-foreground">
                  {r.time}
                </span>
                {r.offset && (
                  <span className="text-xs text-muted-foreground">
                    {r.offset}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
