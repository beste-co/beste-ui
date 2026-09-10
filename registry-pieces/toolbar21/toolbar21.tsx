"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarDays, Filter, List, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Segment {
  icon: LucideIcon;
  label: string;
}

interface Toolbar21Props {
  segments?: Segment[];
  activeIndex?: number;
  count?: string;
  filterLabel?: string;
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
const surfaceClasses: Record<Surface, { plain: string; inverted: string }> = {
  card: {
    plain: "bg-card text-card-foreground",
    inverted: "bg-foreground text-background",
  },
  glass: {
    plain: "bg-card/60 text-card-foreground backdrop-blur-md",
    inverted: "bg-foreground/60 text-background backdrop-blur-md",
  },
};

export const toolbar21Demo: Toolbar21Props = {
  surface: "card",
  bordered: true,
  inverted: false,
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
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Toolbar21Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        className={cn(
          "flex w-full max-w-96 flex-col gap-3 rounded-md p-3 shadow-xl",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center gap-1 rounded-md bg-current/10 p-1">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            const isActive = index === activeIndex;
            return (
              <span
                key={index}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium",
                  isActive
                    ? "bg-current/25 shadow-sm"
                    : "text-current/60"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {segment.label}
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          {count && <span className="text-sm tabular-nums text-current/60">{count}</span>}
          {filterLabel && (
            <span className="flex items-center gap-1.5 rounded-md border border-current/15 px-2.5 py-1 text-sm">
              <Filter className="size-3.5 text-current/60" aria-hidden="true" />
              {filterLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
