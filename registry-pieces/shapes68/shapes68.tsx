"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes68Props {
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

export const shapes68Demo: Shapes68Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes68({ surface = "card", bordered = false, inverted = false, className }: Shapes68Props) {
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
        <div className="flex items-center">
          <span className="size-4 rounded-full bg-primary" />
          <span className="h-0.5 flex-1 bg-primary" />
          <span className="flex size-4 items-center justify-center rounded-full border-2 border-current">
            <span className="size-1.5 rounded-full bg-current" />
          </span>
          <span className="h-0.5 flex-1 bg-current/10" />
          <span className="size-4 rounded-full border-2 border-current/20" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-current/10" />
            <span className={cn("h-6 w-full rounded-sm text-foreground", bordered ? "border border-current/15 bg-background" : "bg-current/10")} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="h-1 w-12 rounded-full bg-current/10" />
            <span className={cn("h-6 w-full rounded-sm text-foreground", bordered ? "border border-current/15 bg-background" : "bg-current/10")} />
          </div>
          <div className="mt-1 flex justify-between">
            <span className="h-5 w-14 rounded-sm border border-current/15" />
            <span className="h-5 w-14 rounded-sm bg-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
