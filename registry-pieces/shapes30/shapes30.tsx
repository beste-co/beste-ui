"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes30Props {
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

export const shapes30Demo: Shapes30Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes30({ surface = "card", bordered = false, inverted = false, className }: Shapes30Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col items-center gap-2 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="h-2.5 w-2/3 rounded-full bg-current/70" />
        <span className="h-2.5 w-1/2 rounded-full bg-current/70" />
        <div className="mt-1 flex w-full flex-col items-center gap-1">
          <span className="h-1 w-3/4 rounded-full bg-current/10" />
          <span className="h-1 w-2/3 rounded-full bg-current/10" />
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          <span className="h-4 w-12 rounded-sm bg-current" />
          <span className="h-4 w-12 rounded-sm border border-current/15" />
        </div>
      </div>
    </div>
  );
}
