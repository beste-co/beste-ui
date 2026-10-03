"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes40Props {
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

export const shapes40Demo: Shapes40Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes40({ surface = "card", bordered = false, inverted = false, className }: Shapes40Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-44 flex-col gap-1.5 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex w-fit flex-col gap-1 rounded-lg rounded-bl-sm bg-current/10 px-3 py-2">
          <span className="h-1 w-12 rounded-full bg-current/30" />
          <span className="h-1 w-16 rounded-full bg-current/30" />
        </div>
        <div className="ml-auto flex w-fit flex-col gap-1 rounded-lg rounded-br-sm bg-primary px-3 py-2">
          <span className="h-1 w-20 rounded-full bg-primary-foreground/50" />
        </div>
        <div className="flex w-fit flex-col gap-1 rounded-lg rounded-bl-sm bg-current/10 px-3 py-2">
          <span className="h-1 w-10 rounded-full bg-current/30" />
        </div>
      </div>
    </div>
  );
}
