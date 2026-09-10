"use client";

import { ArrowLeft, ArrowRight, Home, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Browser6Props {
  canGoBack?: boolean;
  canGoForward?: boolean;
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

export const browser6Demo: Browser6Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  canGoBack: true,
  canGoForward: false,
};

export function Browser6({
  canGoBack = true,
  canGoForward = true,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser6Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-1 rounded-full p-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {[
          { Icon: ArrowLeft, label: "Back", disabled: !canGoBack },
          { Icon: ArrowRight, label: "Forward", disabled: !canGoForward },
          { Icon: RefreshCw, label: "Reload" },
          { Icon: Home, label: "Home" },
        ].map(({ Icon, label, disabled }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            disabled={disabled}
            className="flex size-7 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
