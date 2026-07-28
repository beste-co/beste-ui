"use client";

import { CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input10Props {
  value?: string;
  placeholder?: string;
  className?: string;
}

export const input10Demo: Input10Props = {
  value:
    "Thanks for the thorough write-up. Two things came to mind while reading — first, the retry logic feels brittle around rate limits;",
  placeholder: "Leave feedback…",
};

export function Input10({
  value = "",
  placeholder = "Write something…",
  className,
}: Input10Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1 rounded-md border border-border bg-card p-3 shadow-sm">
        <div className="flex min-h-24 items-start">
          <span
            className={cn(
              "flex-1 text-sm leading-snug",
              value ? "text-card-foreground" : "text-muted-foreground"
            )}
          >
            {value || placeholder}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CornerDownRight className="size-3" aria-hidden="true" />
            Shift + ↵ for new line
          </span>
          <button
            type="button"
            aria-label="Resize"
            className="size-3 cursor-nwse-resize border-b-2 border-r-2 border-muted-foreground/40"
          />
        </div>
      </div>
    </div>
  );
}
