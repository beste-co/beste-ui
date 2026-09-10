"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ticket3Props {
  origin?: string;
  destination?: string;
  departTime?: string;
  arriveTime?: string;
  service?: string;
  platform?: string;
  platformLabel?: string;
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

export const ticket3Demo: Ticket3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  origin: "Berlin Hbf",
  destination: "München Hbf",
  departTime: "09:42",
  arriveTime: "13:05",
  service: "ICE 624",
  platform: "7",
  platformLabel: "Platform",
};

export function Ticket3({
  origin,
  destination,
  departTime,
  arriveTime,
  service,
  platform,
  platformLabel = "Platform",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ticket3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center p-3">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-base font-bold">
              {departTime}
            </div>
            <div className="truncate text-sm">
              {origin}
            </div>
          </div>
          <span
            className="px-3 text-base text-current/60"
            aria-hidden="true"
          >
            →
          </span>
          <div className="min-w-0 flex-1 text-right">
            <div className="font-mono text-base font-bold">
              {arriveTime}
            </div>
            <div className="truncate text-sm">
              {destination}
            </div>
          </div>
        </div>
        <div
          className="border-t border-dashed border-current/15"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between bg-current/10 px-3 py-1.5 text-xs">
          <span className="font-mono font-semibold">
            {service}
          </span>
          {platform && (
            <span className="text-current/60">
              {platformLabel} {platform}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
