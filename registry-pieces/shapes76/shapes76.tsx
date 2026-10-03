"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes76Props {
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

export const shapes76Demo: Shapes76Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes76({ surface = "card", bordered = false, inverted = false, className }: Shapes76Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col items-center gap-2 rounded-md p-5", surfaceTone, bordered && "border-2 border-dashed border-current/20")}
        aria-hidden="true"
      >
        <Upload className="size-7 text-current/50" />
        <div className="flex flex-col items-center gap-1">
          <span className="h-1.5 w-24 rounded-full bg-current/70" />
          <span className="h-1 w-16 rounded-full bg-current/10" />
        </div>
      </div>
    </div>
  );
}
