"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes24Props {
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

export const shapes24Demo: Shapes24Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes24({ surface = "card", bordered = false, inverted = false, className }: Shapes24Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  const selectedRow = 1;
  const selectedCol = 3;

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex flex-col gap-1.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="h-1 rounded-full bg-current/30" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, col) => {
              const isSelected = row === selectedRow && col === selectedCol;
              return (
                <span
                  key={col}
                  className={cn(
                    "size-3 rounded-sm",
                    isSelected ? "bg-current" : "bg-current/10"
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
