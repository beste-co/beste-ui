"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Browser7Props {
  tabs?: string[];
  activeIndex?: number;
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

export const browser7Demo: Browser7Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  tabs: ["Elements", "Console", "Sources", "Network", "Performance"],
  activeIndex: 3,
};

export function Browser7({
  tabs = [],
  activeIndex = 0,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser7Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center overflow-x-auto rounded-md px-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {tabs.map((label, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={idx}
              type="button"
              className={cn(
                "relative shrink-0 px-3 py-2 font-mono text-xs transition-colors",
                isActive
                  ? ""
                  : "text-current/60 hover:text-current"
              )}
            >
              {label}
              {isActive && (
                <span
                  className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary text-primary-foreground"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
