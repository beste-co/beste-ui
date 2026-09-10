"use client";

import { Copy, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

type Reaction = "up" | "down" | null;

interface Ai15Props {
  reaction?: Reaction;
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

export const ai15Demo: Ai15Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  reaction: "up",
};

export function Ai15({ reaction = null, surface = "card", bordered = true, inverted = false, className }: Ai15Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-0.5 rounded-full p-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <button
          type="button"
          aria-label="Helpful"
          aria-pressed={reaction === "up"}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            reaction === "up"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              : "text-current/60 hover:bg-current/10 hover:text-current"
          )}
        >
          <ThumbsUp
            className={cn("size-3.5", reaction === "up" && "fill-current")}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          aria-label="Not helpful"
          aria-pressed={reaction === "down"}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            reaction === "down"
              ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
              : "text-current/60 hover:bg-current/10 hover:text-current"
          )}
        >
          <ThumbsDown
            className={cn(
              "size-3.5",
              reaction === "down" && "fill-current"
            )}
            aria-hidden="true"
          />
        </button>
        <div className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label="Copy"
          className="flex size-7 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
        >
          <Copy className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Share"
          className="flex size-7 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
