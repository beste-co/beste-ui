"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Search23Props {
  placeholder?: string;
  shortcut?: string;
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

export const search23Demo: Search23Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  placeholder: "Search members, invoices, notes…",
  shortcut: "⌘K",
};

export function Search23({
  placeholder = "Search…",
  shortcut,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Search23Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md px-4 py-3 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <Search className="size-4 shrink-0 text-current/60" aria-hidden="true" />
        <span className="flex-1 truncate text-sm text-current/60">
          {placeholder}
        </span>
        {shortcut && (
          <kbd className="shrink-0 rounded border border-current/15 bg-current/10 px-1.5 py-0.5 font-mono text-xs text-current/60">
            {shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
}
