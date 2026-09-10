"use client";

import { Search } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Search1Props {
  placeholder?: string;
  shortcut?: string[];
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

export const search1Demo: Search1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  placeholder: "Search anything...",
  shortcut: ["⌘", "K"],
};

export function Search1({
  placeholder = "Search...",
  shortcut,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Search1Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-72 items-center gap-2 rounded-lg px-3 py-2 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <Search
          className="size-3.5 shrink-0 text-current/60"
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-sm text-current/60">
          {placeholder}
        </span>
        {shortcut && shortcut.length > 0 && (
          <div className="flex items-center gap-0.5" aria-hidden="true">
            {shortcut.map((key, i) => (
              <Fragment key={i}>
                {i > 0 && (
                  <span className="text-xs text-current/35">+</span>
                )}
                <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-current/15 border-b-2 bg-current/10 px-1 font-mono text-xs font-medium text-current/60">
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
