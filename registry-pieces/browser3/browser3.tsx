"use client";

import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Browser3Props {
  url?: string;
  title?: string;
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

export const browser3Demo: Browser3Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  url: "ui.beste.co/components",
  title: "Beste UI",
};

export function Browser3({
  url = "example.com",
  title,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Browser3Props) {
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
          "flex w-full max-w-80 flex-col overflow-hidden rounded-lg shadow-md",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center gap-2 border-b border-current/15 bg-current/5 px-3 py-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-rose-500" />
            <span className="size-2.5 rounded-full bg-amber-500" />
            <span className="size-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="flex flex-1 items-center gap-1.5 rounded-md border border-current/15 bg-current/10 px-2 py-0.5">
            <Globe
              className="size-3 shrink-0 text-current/60"
              aria-hidden="true"
            />
            <span className="truncate font-mono text-xs text-current/60">
              {url}
            </span>
          </div>
        </div>
        <div className="flex min-h-20 items-center justify-center px-4 py-5">
          {title && (
            <span className="text-lg font-semibold">
              {title}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
