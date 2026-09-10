"use client";

import { Folder, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Bookmark {
  label: string;
  folder?: boolean;
}

interface Browser5Props {
  bookmarks?: Bookmark[];
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

export const browser5Demo: Browser5Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  bookmarks: [
    { label: "Work", folder: true },
    { label: "GitHub" },
    { label: "Linear" },
    { label: "Figma" },
    { label: "Reading" },
  ],
};

export function Browser5({ bookmarks = [], surface = "card", bordered = true, inverted = false, className }: Browser5Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-1 overflow-hidden rounded-md px-2 py-1 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        {bookmarks.map((b, i) => {
          const Icon = b.folder ? Folder : Star;
          return (
            <div
              key={i}
              className="flex shrink-0 items-center gap-1 rounded px-1.5 py-1 text-xs transition-colors hover:bg-current/10"
            >
              <Icon
                className={cn(
                  "size-3",
                  b.folder
                    ? "text-amber-500 fill-amber-400"
                    : "text-current/60"
                )}
                aria-hidden="true"
              />
              <span className="truncate font-medium">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
