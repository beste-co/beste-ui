"use client";

import { Lock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Browser4Props {
  url?: string;
  secure?: boolean;
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

export const browser4Demo: Browser4Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  url: "https://stripe.com/dashboard",
  secure: true,
};

export function Browser4({
  url = "https://example.com",
  secure = true,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser4Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-2 rounded-full px-3 py-1.5 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {secure && (
          <Lock
            className="size-3.5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
        )}
        <span className="flex-1 truncate font-mono text-sm">
          {url}
        </span>
        <button
          type="button"
          aria-label="Reload"
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
