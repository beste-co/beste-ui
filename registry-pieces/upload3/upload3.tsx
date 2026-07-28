"use client";

import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface Upload3Props {
  label?: string;
  action?: string;
  className?: string;
}

export const upload3Demo: Upload3Props = {
  label: "Attach supporting documents",
  action: "Browse",
};

export function Upload3({
  label,
  action = "Browse",
  className,
}: Upload3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-card px-3 py-2.5 shadow-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Paperclip
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate text-sm text-muted-foreground">
            {label}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-card-foreground hover:bg-muted-foreground/10"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
