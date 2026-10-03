"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes23Props {
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

export const shapes23Demo: Shapes23Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes23({ surface = "card", bordered = false, inverted = false, className }: Shapes23Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex h-9 w-44 items-center gap-2 rounded-full px-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <Search className="size-4 text-current/50" />
        <span className="h-1 w-20 rounded-full bg-current/10" />
      </div>
    </div>
  );
}
