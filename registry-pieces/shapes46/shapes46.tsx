"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes46Props {
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

export const shapes46Demo: Shapes46Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes46({ surface = "card", bordered = false, inverted = false, className }: Shapes46Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-2 w-3/4 rounded-full bg-current/70" />
          <span className="h-2 w-1/2 rounded-full bg-current/70" />
          <span className="h-1 w-full rounded-full bg-current/10" />
          <span className="h-1 w-2/3 rounded-full bg-current/10" />
          <span className="mt-1 h-4 w-12 rounded-sm bg-current" />
        </div>
        <span className="h-24 w-16 shrink-0 rounded-md bg-current/10" />
      </div>
    </div>
  );
}
