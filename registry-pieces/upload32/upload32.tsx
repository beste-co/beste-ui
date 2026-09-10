"use client";

import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type Surface = "card" | "glass";

interface UploadFile {
  name: string;
  percent: number;
}

interface Upload32Props {
  title?: string;
  hint?: string;
  file?: UploadFile;
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

export const upload32Demo: Upload32Props = {
  surface: "card",
  bordered: true,
  inverted: false,
  title: "Import member records",
  hint: "Drop a CSV or browse — we map the fields",
  file: { name: "members_export_2026.csv", percent: 72 },
};

export function Upload32({
  title,
  hint,
  file,
  surface = "card",
  bordered = true,
  inverted = false,
  className,
}: Upload32Props) {
  const surfaceTone = surfaceClasses[surface][inverted ? "inverted" : "plain"];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("w-full max-w-80 rounded-md p-4 shadow-xl", surfaceTone, bordered && "border border-current/15")}>
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-current/15 bg-current/10 px-4 py-6 text-center">
          <span
            className="flex size-10 items-center justify-center rounded-md bg-background text-foreground/60"
            aria-hidden="true"
          >
            <UploadCloud className="size-5" />
          </span>
          {title && (
            <p className="text-sm font-medium">{title}</p>
          )}
          {hint && <p className="text-xs text-current/60">{hint}</p>}
        </div>

        {file && (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate">{file.name}</span>
              <span className="shrink-0 text-current/60">
                {file.percent}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-current/10">
              <div
                className="h-full rounded-full bg-primary text-primary-foreground"
                style={{ width: `${Math.max(0, Math.min(file.percent, 100))}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
