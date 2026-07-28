"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface Hop {
  code: string;
  caption?: string;
}

interface Travel23Props {
  hops?: Hop[];
  summary?: string;
  className?: string;
}

export const travel23Demo: Travel23Props = {
  hops: [
    { code: "IST", caption: "Depart" },
    { code: "DOH", caption: "2h" },
    { code: "BKK", caption: "4 days" },
    { code: "SIN", caption: "3 days" },
    { code: "TYO", caption: "Return" },
  ],
  summary: "11-day multi-city itinerary",
};

export function Travel23({ hops = [], summary, className }: Travel23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            {hops.map((_, idx) => (
              <Fragment key={idx}>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    idx === 0 || idx === hops.length - 1
                      ? "bg-foreground"
                      : "bg-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                {idx < hops.length - 1 && (
                  <span
                    className="h-px flex-1 bg-border"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </div>
          <div className="flex items-start justify-between">
            {hops.map((hop, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="font-mono text-sm font-semibold tracking-wider text-card-foreground">
                  {hop.code}
                </span>
                {hop.caption && (
                  <span className="text-xs text-muted-foreground">
                    {hop.caption}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {summary && (
          <span className="border-t border-border pt-2.5 text-sm text-muted-foreground">
            {summary}
          </span>
        )}
      </div>
    </div>
  );
}
