"use client";

import { cn } from "@/lib/utils";

const INTENSITY: Record<number, string> = {
  0: "bg-current/10",
  1: "bg-current/30",
  2: "bg-current/60",
  3: "bg-current",
};

const CELLS = [
  1, 0, 2, 1, 3, 0, 1,
  0, 2, 1, 0, 2, 3, 1,
  1, 3, 2, 1, 0, 1, 2,
  2, 1, 0, 3, 1, 2, 0,
  0, 1, 3, 2, 1, 0, 2,
];

type Surface = "card" | "glass";

interface Shapes22Props {
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

export const shapes22Demo: Shapes22Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes22({ surface = "card", bordered = false, inverted = false, className }: Shapes22Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("grid grid-cols-7 gap-1 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        {CELLS.map((level, i) => (
          <span
            key={i}
            className={cn("size-2.5 rounded-sm", INTENSITY[level])}
          />
        ))}
      </div>
    </div>
  );
}
