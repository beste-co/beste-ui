"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Tooltip3Props {
  title?: string;
  description?: string;
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

export const tooltip3Demo: Tooltip3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Monthly recurring revenue",
  description:
    "Sum of normalized subscriptions divided by months, excluding one-time charges.",
};

export function Tooltip3({
  title,
  description,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Tooltip3Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative">
        <div className={cn("flex w-64 items-start gap-2.5 rounded-lg p-3 shadow-lg", surfaceTone, bordered && "border border-current/15")}>
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Info className="size-3.5" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {title && (
              <span className="text-xs font-semibold">
                {title}
              </span>
            )}
            {description && (
              <span className="text-xs leading-snug text-current/60">
                {description}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn("absolute -top-1 left-6 size-2 rotate-45 border-l border-t border-current/15 ", surfaceTone)}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
