"use client";

import { Pin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Chat19Props {
  preview?: string;
  author?: string;
  className?: string;
}

export const chat19Demo: Chat19Props = {
  preview: "Launch checklist → notion.so/beste/launch",
  author: "Ayşe",
};

export function Chat19({
  preview = "Pinned message",
  author,
  className,
}: Chat19Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center gap-2.5 rounded-md bg-card px-3 py-2 shadow-sm">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
          aria-hidden="true"
        >
          <Pin className="size-3.5 fill-current" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pinned {author && `by ${author}`}
          </span>
          <span className="truncate text-sm font-medium text-card-foreground">
            {preview}
          </span>
        </div>
        <button
          type="button"
          aria-label="Unpin"
          className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
