"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes20Props {
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

export const shapes20Demo: Shapes20Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes20({ surface = "card", bordered = false, inverted = false, className }: Shapes20Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col overflow-hidden rounded-md shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 border-b border-current/15 bg-current/10 px-3 py-2">
          <span className="size-2 rounded-full bg-current/30" />
          <span className="size-2 rounded-full bg-current/30" />
          <span className="size-2 rounded-full bg-current/30" />
        </div>
        <div className="flex flex-col gap-1.5 p-3">
          <span className="h-1.5 w-3/4 rounded-full bg-current/10" />
          <span className="h-1.5 w-1/2 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
