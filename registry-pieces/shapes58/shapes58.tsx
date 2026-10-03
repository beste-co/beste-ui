"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes58Props {
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

export const shapes58Demo: Shapes58Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes58({ surface = "card", bordered = false, inverted = false, className }: Shapes58Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 flex-col items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="h-1.5 w-24 rounded-full bg-current/70" />
        <div className="grid w-full grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-6 rounded-sm bg-current/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
