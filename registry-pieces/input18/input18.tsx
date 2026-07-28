"use client";

import { Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input18Props {
  label?: string;
  filename?: string;
  size?: string;
  className?: string;
}

export const input18Demo: Input18Props = {
  label: "Attach ID document",
  filename: "passport-scan.pdf",
  size: "842 KB",
};

export function Input18({
  label,
  filename,
  size,
  className,
}: Input18Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2 rounded-md border border-border bg-card p-1.5 shadow-sm">
          <button
            type="button"
            className="shrink-0 rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs font-semibold text-card-foreground hover:bg-muted-foreground/10"
          >
            Choose file
          </button>
          {filename ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Paperclip
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate text-xs font-medium text-card-foreground">
                {filename}
              </span>
              {size && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {size}
                </span>
              )}
              <button
                type="button"
                className="flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted"
                aria-label="Remove"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">
              No file chosen
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
