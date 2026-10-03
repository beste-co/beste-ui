"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes25Props {
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

export const shapes25Demo: Shapes25Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes25({ surface = "card", bordered = false, inverted = false, className }: Shapes25Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex items-center gap-5 pb-2">
          <span className="h-1.5 w-8 rounded-full bg-current" />
          <span className="h-1.5 w-10 rounded-full bg-current/10" />
          <span className="h-1.5 w-6 rounded-full bg-current/10" />
        </div>
        <div className="relative h-px w-full bg-current/15">
          <span className="absolute -top-px left-0 h-0.5 w-8 rounded-full bg-current" />
        </div>
      </div>
    </div>
  );
}
