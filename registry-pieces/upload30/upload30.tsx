"use client";

import { FileArchive } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface Upload30Props {
  filename?: string;
  totalSize?: string;
  files?: number;
  savings?: string;
  filesLabel?: string;
  downloadLabel?: string;
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

export const upload30Demo: Upload30Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  filename: "project-handoff.zip",
  totalSize: "248 MB",
  files: 42,
  savings: "Compressed from 612 MB · 59% smaller",
  filesLabel: "files",
  downloadLabel: "Download",
};

export function Upload30({
  filename,
  totalSize,
  files = 0,
  savings,
  filesLabel = "files",
  downloadLabel = "Download",
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Upload30Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-3 rounded-md p-3 shadow-sm", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
          <FileArchive className="size-5" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {filename && (
            <span className="truncate text-sm font-semibold">
              {filename}
            </span>
          )}
          <span className="text-xs text-current/60">
            {files} {filesLabel} · {totalSize}
          </span>
          {savings && (
            <span className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {savings}
            </span>
          )}
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background hover:opacity-90"
        >
          {downloadLabel}
        </button>
      </div>
    </div>
  );
}
