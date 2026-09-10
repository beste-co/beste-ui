"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ticket6Props {
  code?: string;
  headerLabel?: string;
  plate?: string;
  spotPrefix?: string;
  enteredAt?: string;
  level?: string;
  spot?: string;
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

export const ticket6Demo: Ticket6Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  code: "P-2891",
  headerLabel: "Parking",
  plate: "ABC 1234",
  spotPrefix: "Spot",
  enteredAt: "Jun 14 · 14:32",
  level: "Level 2",
  spot: "B-08",
};

export function Ticket6({
  code,
  headerLabel = "Parking",
  plate,
  spotPrefix = "Spot",
  enteredAt,
  level,
  spot,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ticket6Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 overflow-hidden rounded-lg shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center justify-between bg-current/10 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-current/60">
            {headerLabel}
          </span>
          <span className="font-mono text-xs font-semibold">
            {code}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <span className="font-mono text-xl font-bold tracking-wide">
            {plate}
          </span>
          <div className="flex items-center justify-between text-xs text-current/60">
            <span>{enteredAt}</span>
            {(level || spot) && (
              <span>
                {level}
                {level && spot && " · "}
                {spot && `${spotPrefix} ${spot}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
