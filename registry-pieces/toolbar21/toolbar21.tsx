"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Filter, List, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Segment {
  icon: LucideIcon;
  label: string;
}

interface Toolbar21Props {
  segments?: Segment[];
  activeIndex?: number;
  count?: string;
  filterLabel?: string;
  className?: string;
}

export const toolbar21Demo: Toolbar21Props = {
  segments: [
    { icon: List, label: "List" },
    { icon: CalendarDays, label: "Week" },
    { icon: Rows3, label: "Rooms" },
  ],
  activeIndex: 1,
  count: "142 appointments",
  filterLabel: "All sites",
};

export function Toolbar21({
  segments = [],
  activeIndex = 0,
  count,
  filterLabel,
  className,
}: Toolbar21Props) {
  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div className="flex w-full max-w-96 flex-col gap-3 rounded-md border border-border bg-card p-3 shadow-xl">
        <div className="flex items-center gap-1 rounded-md bg-muted p-1">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            const isActive = index === activeIndex;
            return (
              <span
                key={index}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium",
                  isActive
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {segment.label}
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          {count && <span className="text-sm tabular-nums text-muted-foreground">{count}</span>}
          {filterLabel && (
            <span className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-sm text-card-foreground">
              <Filter className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {filterLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
