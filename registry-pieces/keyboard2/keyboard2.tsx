"use client";

import { Fragment } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Keyboard2Props {
  action?: string;
  hint?: string;
  keys?: string[];
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

export const keyboard2Demo: Keyboard2Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  action: "Go to file",
  hint: "Jump to any file in the workspace",
  keys: ["⌘", "P"],
};

export function Keyboard2({
  action,
  hint,
  keys = [],
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Keyboard2Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-lg p-2.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-current/10 text-current/60">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {action && (
            <span className="truncate text-sm font-medium">
              {action}
            </span>
          )}
          {hint && (
            <span className="truncate text-xs text-current/60">
              {hint}
            </span>
          )}
        </div>
        {keys.length > 0 && (
          <div className="flex shrink-0 items-center gap-1">
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
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current/15 border-b-2 bg-background px-1.5 font-mono text-xs font-medium text-foreground/60">
                  {key}
                </kbd>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
