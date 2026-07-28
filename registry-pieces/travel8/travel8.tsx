"use client";

import { cn } from "@/lib/utils";

interface Travel8Stat {
  value: string;
  label: string;
}

interface Travel8Props {
  year?: string;
  stats?: Travel8Stat[];
  className?: string;
}

export const travel8Demo: Travel8Props = {
  year: "This year",
  stats: [
    { value: "18", label: "Countries" },
    { value: "42", label: "Flights" },
    { value: "96,240", label: "Miles" },
  ],
};

export function Travel8({ year, stats = [], className }: Travel8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 flex-col gap-1.5 rounded-lg border border-border bg-card p-2.5 shadow-sm">
        {year && (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {year}
          </span>
        )}
        <div className="grid grid-cols-3 gap-1.5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-0.5 rounded-md bg-muted/60 px-2 py-1.5"
            >
              <span className="font-mono text-base font-bold tabular-nums text-card-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
