"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes78Props {
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}

// Everything inside the card is drawn in `current`, so inverting is two classes
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

export const shapes78Demo: Shapes78Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes78({ surface = "card", bordered = false, inverted = false, className }: Shapes78Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("grid h-32 w-48 grid-cols-3 grid-rows-2 gap-1.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="col-span-2 row-span-2 rounded-md bg-current/10" />
        <div className="rounded-md bg-current/10" />
        <div className="relative overflow-hidden rounded-md bg-current/10">
          <span className="absolute inset-0 flex items-center justify-center bg-current/30">
            <span className="h-1.5 w-5 rounded-full bg-current" />
          </span>
        </div>
      </div>
    </div>
  );
}
