"use client";

import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Upload1Props {
  filename?: string;
  size?: string;
  progress?: number;
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

export const upload1Demo: Upload1Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  filename: "brand-guidelines.pdf",
  size: "12.4 MB",
  progress: 68,
};

export function Upload1({
  filename,
  size,
  progress = 0,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Upload1Props) {
  const pct = Math.max(0, Math.min(100, progress));

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
          "flex w-full max-w-60 flex-col gap-2 rounded-lg p-3 shadow-sm",
          surfaceTone,
          bordered && "border border-current/15"
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <FileText className="size-4" aria-hidden="true" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-medium">
              {filename}
            </span>
            <span className="text-xs text-current/60">
              {size} · {pct}%
            </span>
          </div>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-current/10">
          <div
            className="h-full rounded-full bg-sky-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
