"use client";

import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Ai1Props {
  placeholder?: string;
  value?: string;
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

export const ai1Demo: Ai1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  placeholder: "Ask anything...",
  value: "Write a landing page hero for a coffee roaster",
};

export function Ai1({
  placeholder = "Ask",
  value = "",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Ai1Props) {
  const hasValue = value.length > 0;

  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-80 flex-col gap-2 rounded-2xl p-3 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-start gap-2">
          <Sparkles
            className="mt-0.5 size-4 shrink-0 text-violet-500"
            aria-hidden="true"
          />
          <p
            className={cn(
              "min-w-0 flex-1 text-sm leading-snug",
              hasValue ? "" : "text-current/60"
            )}
          >
            {hasValue ? value : placeholder}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Attach"
            className="flex size-7 items-center justify-center rounded-full text-current/60 transition-colors hover:bg-current/10 hover:text-current"
          >
            <Paperclip className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Send"
            disabled={!hasValue}
            className={cn(
              "flex size-7 items-center justify-center rounded-full transition-colors",
              hasValue
                ? "bg-foreground text-background hover:bg-current/90"
                : "bg-current/10 text-current/60"
            )}
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
