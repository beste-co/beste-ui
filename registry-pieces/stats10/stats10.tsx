"use client";

import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Stats10Props {
  value?: string;
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

export const stats10Demo: Stats10Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  value: "1,284",
  label: "Online now",
};

export function Stats10({
  value = "0",
  label,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Stats10Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-3 rounded-lg px-4 py-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <span className="relative flex size-2.5 items-center justify-center">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60"
            aria-hidden="true"
          />
          <span
            className="relative size-2.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
        </span>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums leading-none">
            {value}
          </span>
          {label && (
            <span className="text-xs font-medium uppercase tracking-wide text-current/60">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
