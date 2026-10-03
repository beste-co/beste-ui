"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes18Props {
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

export const shapes18Demo: Shapes18Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes18({ surface = "card", bordered = false, inverted = false, className }: Shapes18Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 items-start gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <span className="size-7 shrink-0 rounded-full bg-current/10" />
        <div className="flex flex-1 flex-col gap-1.5 pt-1">
          <span className="h-1.5 w-3/4 rounded-full bg-current" />
          <span className="h-1.5 w-1/2 rounded-full bg-current/10" />
        </div>
        <span className="size-2 shrink-0 rounded-full bg-primary" />
      </div>
    </div>
  );
}
