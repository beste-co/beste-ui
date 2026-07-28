"use client";

import { cn } from "@/lib/utils";

interface Ticket7Props {
  number?: string;
  ahead?: number;
  waitTime?: string;
  className?: string;
}

export const ticket7Demo: Ticket7Props = {
  number: "A47",
  ahead: 3,
  waitTime: "~12 min",
};

export function Ticket7({ number, ahead, waitTime, className }: Ticket7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="w-full max-w-80 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col items-center gap-1 p-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Your Number
          </span>
          <span className="font-mono text-4xl font-bold tabular-nums tracking-wider text-card-foreground">
            {number}
          </span>
        </div>
        <div
          className="border-t border-dashed border-border"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {ahead !== undefined && <span>{ahead} ahead of you</span>}
          {waitTime && <span>Est. wait {waitTime}</span>}
        </div>
      </div>
    </div>
  );
}
