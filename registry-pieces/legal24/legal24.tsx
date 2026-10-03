"use client";

import { cn } from "@/lib/utils";

interface TimeEntry {
  date?: string;
  task: string;
  hours: string;
}

interface Legal24Props {
  client?: string;
  rate?: string;
  entries?: TimeEntry[];
  total?: string;
  bordered?: boolean;
  className?: string;
}

export const legal24Demo: Legal24Props = {
  client: "Kestrel Labs",
  entries: [
    { task: "Redline of Schedule B", hours: "2.4" },
    { task: "Call with opposing counsel", hours: "1.1" },
    { task: "Drafting regulatory memo", hours: "3.8" },
  ],
  total: "$4,745.00",
  bordered: false,
};

export function Legal24({
  client,
  rate,
  entries = [],
  total,
  bordered = false,
  className,
}: Legal24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-xl bg-card p-3 shadow-sm", bordered && "border border-border")}>
        {(client || rate) && (
          <div className="flex min-w-0 flex-col">
            {client && (
              <span className="truncate text-xs font-semibold text-muted-foreground">
                {client}
              </span>
            )}
            {rate && (
              <span className="truncate text-xs tabular-nums text-card-foreground">
                {rate}
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col divide-y divide-border">
          {entries.map((e, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 py-1 text-xs"
            >
              {e.date && (
                <span className="w-12 shrink-0 text-muted-foreground">
                  {e.date}
                </span>
              )}
              <span className="flex-1 truncate text-card-foreground">
                {e.task}
              </span>
              <span className="font-semibold tabular-nums text-card-foreground">
                {e.hours}
              </span>
            </div>
          ))}
        </div>
        {total && (
          <span className="border-t border-border pt-2 text-right text-sm font-bold tabular-nums text-card-foreground">
            {total}
          </span>
        )}
      </div>
    </div>
  );
}
