"use client";

import { cn } from "@/lib/utils";

interface Travel8Stat {
  value: string;
  label: string;
}

interface Travel8Props {
  year?: string;
  stats?: Travel8Stat[];
  bordered?: boolean;
  className?: string;
}

export const travel8Demo: Travel8Props = {
  stats: [
    { value: "18", label: "Countries" },
    { value: "42", label: "Flights" },
    { value: "96,240", label: "Miles" },
  ],
  bordered: false,
};

export function Travel8({ year, stats = [], bordered = false, className }: Travel8Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 flex-col gap-1.5 rounded-lg bg-card p-2.5 shadow-sm", bordered && "border border-border")}>
        {year && (
          <span className="text-xs font-semibold text-muted-foreground">
            {year}
          </span>
        )}
        <div className="grid grid-cols-3 gap-1.5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-0.5 rounded-md bg-muted/60 px-2 py-1.5"
            >
              <span className="text-base font-bold tabular-nums text-card-foreground">
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
