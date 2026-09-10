"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Keyboard1Props {
  keys?: string[];
  label?: string;
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

export const keyboard1Demo: Keyboard1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  keys: ["⌘", "K"],
  label: "Quick search",
};

export function Keyboard1({
  keys = ["⌘", "K"],
  label,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Keyboard1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2.5 rounded-lg px-3 py-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {label && (
          <span className="text-xs font-medium text-current/60">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1">
          {keys.map((key, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <span
                  className="text-xs text-current/35"
                  aria-hidden="true"
                >
                  +
                </span>
              )}
              <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current/15 border-b-2 bg-current/10 px-1.5 font-mono text-xs font-medium">
                {key}
              </kbd>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
