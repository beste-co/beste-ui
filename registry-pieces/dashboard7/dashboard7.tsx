"use client";

import { Calendar, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Dashboard7Props {
  range?: string;
  compare?: string;
  segment?: string;
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

export const dashboard7Demo: Dashboard7Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  range: "Apr 1 – Apr 21",
  compare: "vs previous",
  segment: "All segments",
};

export function Dashboard7({
  range = "Last 30 days",
  compare,
  segment,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Dashboard7Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-1.5 rounded-md p-1.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <button
          type="button"
          className="flex flex-1 items-center gap-1.5 rounded-sm bg-current/10 px-2 py-1 text-xs font-medium"
        >
          <Calendar className="size-3" aria-hidden="true" />
          <span className="truncate">{range}</span>
          <ChevronDown
            className="ml-auto size-3 text-current/60"
            aria-hidden="true"
          />
        </button>
        {compare && (
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-current/60 hover:bg-current/10"
          >
            {compare}
            <ChevronDown className="size-3" aria-hidden="true" />
          </button>
        )}
        {segment && (
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm px-2 py-1 text-xs text-current/60 hover:bg-current/10"
            aria-label="Segment filter"
          >
            <SlidersHorizontal className="size-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
