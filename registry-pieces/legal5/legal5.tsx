"use client";

import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Legal5Props {
  section?: string;
  heading?: string;
  body?: string;
  source?: string;
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

export const legal5Demo: Legal5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  section: "§ 4.2",
  heading: "Limitation of liability",
  body: "In no event shall either party be liable for any indirect, incidental, special, or consequential damages arising out of this agreement, even if advised of the possibility of such damages.",
  source: "Master services agreement · MSA-2026-0421",
};

export function Legal5({
  section,
  heading,
  body,
  source,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Legal5Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 flex-col gap-2 rounded-lg p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">
            {section}
          </span>
          {heading && (
            <span className="truncate text-sm font-semibold">
              {heading}
            </span>
          )}
        </div>
        {body && (
          <p className="text-sm leading-relaxed text-current/60">
            {body}
          </p>
        )}
        {source && (
          <div className="flex items-center gap-1.5 border-t border-current/15 pt-2 text-xs text-current/60">
            <Scale className="size-3" aria-hidden="true" />
            <span className="truncate">{source}</span>
          </div>
        )}
      </div>
    </div>
  );
}
