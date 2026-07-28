"use client";

import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload6Props {
  title?: string;
  hint?: string;
  action?: string;
  className?: string;
}

export const upload6Demo: Upload6Props = {
  title: "Add a cover image",
  hint: "Recommended 1600 × 600, up to 4 MB",
  action: "Upload",
};

export function Upload6({
  title,
  hint,
  action = "Upload",
  className,
}: Upload6Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative flex aspect-video w-full max-w-80 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
        <div
          className="absolute inset-3 rounded-lg border-2 border-dashed border-border"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center gap-1.5 text-foreground">
          <div className="flex size-9 items-center justify-center rounded-full bg-card text-foreground">
            <ImagePlus className="size-4" aria-hidden="true" />
          </div>
          {title && <span className="text-sm font-semibold">{title}</span>}
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
          <button
            type="button"
            className="mt-1 rounded-md bg-foreground px-3 py-1 text-xs font-semibold text-background hover:opacity-90"
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
