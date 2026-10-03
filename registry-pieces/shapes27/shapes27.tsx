"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes27Props {
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

export const shapes27Demo: Shapes27Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes27({ surface = "card", bordered = false, inverted = false, className }: Shapes27Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative p-3" aria-hidden="true">
        <div className="absolute inset-0 rounded-lg bg-foreground/10" />
        <div
          className={cn("relative flex w-44 flex-col gap-2 rounded-md p-3 shadow-lg", surfaceTone, bordered && "border border-current/15")}
        >
          <span className="h-1.5 w-2/3 rounded-full bg-current" />
          <span className="h-1 w-full rounded-full bg-current/10" />
          <span className="h-1 w-3/4 rounded-full bg-current/10" />
          <div className="mt-1 flex justify-end gap-1.5">
            <span className="h-3.5 w-10 rounded-sm bg-current/10" />
            <span className="h-3.5 w-10 rounded-sm bg-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
