"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes77Props {
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

export const shapes77Demo: Shapes77Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes77({ surface = "card", bordered = false, inverted = false, className }: Shapes77Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 flex-col gap-2.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex gap-2">
          <span className="size-7 shrink-0 rounded-full bg-current/10" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-12 rounded-full bg-current/70" />
              <span className="h-1 w-8 rounded-full bg-current/10" />
            </div>
            <span className="h-1 w-full rounded-full bg-current/10" />
            <span className="h-1 w-3/4 rounded-full bg-current/10" />
          </div>
        </div>
        <div className="ml-9 flex gap-2">
          <span className="size-6 shrink-0 rounded-full bg-current/10" />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-10 rounded-full bg-current/70" />
              <span className="h-1 w-6 rounded-full bg-current/10" />
            </div>
            <span className="h-1 w-2/3 rounded-full bg-current/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
