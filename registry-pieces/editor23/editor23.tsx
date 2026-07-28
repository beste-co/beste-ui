"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor23Props {
  filename?: string;
  dirty?: boolean;
  savedAt?: string;
  className?: string;
}

export const editor23Demo: Editor23Props = {
  filename: "button.tsx",
  dirty: false,
  savedAt: "Saved 3s ago",
};

export function Editor23({
  filename = "file",
  dirty = false,
  savedAt,
  className,
}: Editor23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2.5 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
        {dirty ? (
          <Circle
            className="size-3 shrink-0 fill-sky-500 text-sky-500"
            aria-hidden="true"
          />
        ) : (
          <div className="flex size-3 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-2" strokeWidth={3.5} aria-hidden="true" />
          </div>
        )}
        <span className="font-mono text-xs font-semibold text-card-foreground">
          {filename}
        </span>
        <span className="text-xs text-muted-foreground">
          {dirty ? "Unsaved changes" : savedAt ?? "Saved"}
        </span>
      </div>
    </div>
  );
}
