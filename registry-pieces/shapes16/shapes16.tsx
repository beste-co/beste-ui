"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes16Props {
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

export const shapes16Demo: Shapes16Props = {
  surface: "card",
  bordered: false,
  inverted: false,
};

export function Shapes16({ surface = "card", bordered = false, inverted = false, className }: Shapes16Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        <div className="flex flex-col gap-1.5">
          <span className="h-1 w-10 rounded-full bg-current/10" />
          <span className="h-3 w-14 rounded-sm bg-current" />
          <div className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="h-1 w-8 rounded-full bg-current/10" />
          </div>
        </div>
        <svg
          viewBox="0 0 60 30"
          className="ml-auto h-10 w-16 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2,25 10,18 18,22 26,15 34,18 42,8 50,12 58,5" />
        </svg>
      </div>
    </div>
  );
}
