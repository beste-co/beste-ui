"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Shapes50Props {
  surface?: Surface;
  bordered?: boolean;
  inverted?: boolean;
  className?: string;
}


/* The card sets the colour and everything inside it is drawn in `current`, so
   inverting is two classes rather than a condition on every element.
   `glass` is a deliberate exception to the solid-surface rule: these pieces sit
   over section background images, and a frosted panel is the point of it. */
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

export const shapes50Demo: Shapes50Props = {
  surface: "card",
  bordered: true,
  inverted: false,
};

const ROWS: { title: string; body: string }[] = [
  { title: "w-3/4", body: "w-full" },
  { title: "w-1/2", body: "w-3/4" },
  { title: "w-2/3", body: "w-5/6" },
];

export function Shapes50({ surface = "card", bordered = true, inverted = false, className }: Shapes50Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn("flex w-48 flex-col gap-2.5 rounded-md p-3", surfaceTone, bordered && "border border-current/15")}
        aria-hidden="true"
      >
        {ROWS.map((row, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="size-7 shrink-0 rounded-md bg-current/10" />
            <div className="flex flex-1 flex-col gap-1">
              <span
                className={cn("h-1.5 rounded-full bg-current/70", row.title)}
              />
              <span
                className={cn("h-1 rounded-full bg-current/10", row.body)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
