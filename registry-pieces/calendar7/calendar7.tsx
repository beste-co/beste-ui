"use client";

import { cn } from "@/lib/utils";

interface Calendar7Props {
  weekday?: string;
  day?: string;
  month?: string;
  year?: string;
  subtitle?: string;
  className?: string;
}

export const calendar7Demo: Calendar7Props = {
  weekday: "Thursday",
  day: "23",
  month: "April",
  year: "2026",
  subtitle: "Day 113 of the year",
};

export function Calendar7({
  weekday,
  day,
  month,
  year,
  subtitle,
  className,
}: Calendar7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative w-32">
        <span
          className="absolute left-1/2 top-2 h-3 w-1 -translate-x-6 rounded-full bg-muted-foreground/40"
          aria-hidden="true"
        />
        <span
          className="absolute left-1/2 top-2 h-3 w-1 translate-x-5 rounded-full bg-muted-foreground/40"
          aria-hidden="true"
        />
        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card pt-4 shadow-xl">
          <div className="border-b border-dashed border-border bg-muted/40 pb-1.5 pt-1 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {weekday}
          </div>
          <div className="flex flex-col items-center px-2 py-3">
            <span className="font-serif text-5xl font-bold leading-none text-rose-500">
              {day}
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-card-foreground">
              {month}
            </span>
            <span className="text-xs text-muted-foreground">{year}</span>
          </div>
          {subtitle && (
            <span className="border-t border-border bg-muted/30 py-1 text-center text-xs text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
