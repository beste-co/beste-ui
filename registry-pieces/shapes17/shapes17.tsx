"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes17Props {
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

export const shapes17Demo: Shapes17Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes17({ surface = "card", bordered = false, inverted = false, className }: Shapes17Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          <span className="h-full w-1/2 bg-current" />
          <span className="h-full w-1/4 bg-current/50" />
          <span className="h-full w-1/4 bg-current/20" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-current" />
            <span className="h-1 w-4 rounded-full bg-current/10" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-current/50" />
            <span className="h-1 w-4 rounded-full bg-current/10" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-current/20" />
            <span className="h-1 w-4 rounded-full bg-current/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
