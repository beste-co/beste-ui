"use client";

import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeEntry {
  date: string;
  task: string;
  hours: string;
}

interface Legal24Props {
  client?: string;
  rate?: string;
  entries?: TimeEntry[];
  total?: string;
  className?: string;
}

export const legal24Demo: Legal24Props = {
  client: "Kestrel Labs · M&A advisory",
  rate: "$650 / hour",
  entries: [
    { date: "Apr 21", task: "Redline of Schedule B", hours: "2.4" },
    { date: "Apr 22", task: "Call with opposing counsel", hours: "1.1" },
    { date: "Apr 23", task: "Drafting regulatory memo", hours: "3.8" },
  ],
  total: "7.3 h · $4,745.00",
};

export function Legal24({
  client,
  rate,
  entries = [],
  total,
  className,
}: Legal24Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-500">
            <Receipt className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            {client && (
              <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {client}
              </span>
            )}
            {rate && (
              <span className="truncate text-xs text-card-foreground">
                {rate}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col divide-y divide-border">
          {entries.map((e, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 py-1 text-xs"
            >
              <span className="w-12 shrink-0 font-mono text-muted-foreground">
                {e.date}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {e.task}
              </span>
              <span className="font-mono font-semibold text-card-foreground">
                {e.hours}
              </span>
            </div>
          ))}
        </div>
        {total && (
          <span className="border-t border-border pt-2 text-right font-mono text-sm font-bold text-card-foreground">
            {total}
          </span>
        )}
      </div>
    </div>
  );
}
