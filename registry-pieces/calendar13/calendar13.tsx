"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "primary"
  | "foreground"
  | "sky"
  | "emerald"
  | "violet"
  | "amber"
  | "rose";

interface Calendar13Props {
  heading?: string;
  hours?: string[];
  days?: string[];
  busy?: { day: number; hour: number; span?: number }[];
  tone?: Tone;
  className?: string;
}

const busyClasses: Record<Tone, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export const calendar13Demo: Calendar13Props = {
  heading: "Availability · Thu 23 Apr",
  hours: ["09", "10", "11", "12", "13", "14", "15", "16", "17"],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  busy: [
    { day: 0, hour: 1, span: 2 },
    { day: 1, hour: 4, span: 1 },
    { day: 2, hour: 0, span: 2 },
    { day: 3, hour: 3, span: 3 },
    { day: 4, hour: 6, span: 2 },
  ],
  tone: "primary",
};

export function Calendar13({
  heading,
  hours = [],
  days = [],
  busy = [],
  tone = "primary",
  className,
}: Calendar13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        {heading && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {heading}
          </span>
        )}
        <div
          className="grid gap-0.5 text-center text-xs"
          style={{
            gridTemplateColumns: `auto repeat(${hours.length}, minmax(0, 1fr))`,
          }}
        >
          <span aria-hidden="true" />
          {hours.map((h, idx) => (
            <span key={idx} className="font-mono text-muted-foreground">
              {h}
            </span>
          ))}
          {days.map((day, dIdx) => (
            <Fragment key={dIdx}>
              <span className="pr-1 text-right font-semibold uppercase tracking-wide text-muted-foreground">
                {day}
              </span>
              {hours.map((_, hIdx) => {
                const slot = busy.find(
                  (b) =>
                    b.day === dIdx &&
                    hIdx >= b.hour &&
                    hIdx < b.hour + (b.span ?? 1)
                );
                return (
                  <span
                    key={hIdx}
                    className={cn(
                      "aspect-square rounded-sm",
                      slot ? busyClasses[tone] : "bg-muted"
                    )}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span
              className={cn("size-2 rounded-sm", busyClasses[tone])}
              aria-hidden="true"
            />
            Busy
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-sm bg-muted" aria-hidden="true" />
            Free
          </span>
        </div>
      </div>
    </div>
  );
}
