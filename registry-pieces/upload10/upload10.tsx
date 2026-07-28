"use client";

import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload10Props {
  title?: string;
  hint?: string;
  action?: string;
  className?: string;
}

export const upload10Demo: Upload10Props = {
  title: "Scan the receipt",
  hint: "Point the camera at the total line",
  action: "Capture",
};

export function Upload10({
  title,
  hint,
  action = "Capture",
  className,
}: Upload10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative flex aspect-square w-48 flex-col items-center justify-center overflow-hidden rounded-xl bg-foreground p-3 text-background">
        <div
          className="absolute inset-3 rounded-none border-1 border-dashed border-background/50"
          aria-hidden="true"
        >
          <span className="absolute left-0 top-0 size-3 border-l-2 border-t-2 border-background" />
          <span className="absolute right-0 top-0 size-3 border-r-2 border-t-2 border-background" />
          <span className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-background" />
          <span className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-background" />
        </div>
        <div className="relative flex w-full flex-col items-center gap-2">
          {title && (
            <span className="text-sm font-semibold">{title}</span>
          )}
          {hint && (
            <span className="text-xs text-background/70 text-center text-balance">{hint}</span>
          )}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-background text-foreground ring-2 ring-background/40 hover:opacity-90"
            aria-label={action}
          >
            <Camera className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
