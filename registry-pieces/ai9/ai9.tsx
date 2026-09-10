"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai9Props {
  prompts?: string[];
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

export const ai9Demo: Ai9Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  prompts: [
    "Summarize this doc",
    "Draft a reply",
    "Extract action items",
    "Translate to Turkish",
  ],
};

export function Ai9({ prompts = [], surface = "card", bordered = true, inverted = false, className }: Ai9Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-wrap items-center justify-center gap-1.5">
        {prompts.map((p, i) => (
          <button
            key={i}
            type="button"
            className={cn("rounded-full px-3 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-current/10", surfaceTone, bordered && "border border-current/15")}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
