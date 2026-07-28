"use client";

import { Archive, Copy, Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav16Props {
  className?: string;
}

export const nav16Demo: Nav16Props = {};

export function Nav16({ className }: Nav16Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-56 flex-col gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg">
        <span className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Actions
        </span>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Edit3 className="size-3.5" aria-hidden="true" />
          Edit
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            ⌘E
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Copy className="size-3.5" aria-hidden="true" />
          Duplicate
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            ⌘D
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Archive className="size-3.5" aria-hidden="true" />
          Archive
        </button>
        <span
          className="mx-1 my-1 h-px bg-border"
          aria-hidden="true"
        />
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Delete
          <span className="ml-auto font-mono text-xs text-rose-600/70 dark:text-rose-400/70">
            ⌫
          </span>
        </button>
      </div>
    </div>
  );
}
