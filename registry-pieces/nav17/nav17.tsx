"use client";

import { Copy, Link2, Scissors, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Nav17Props {
  className?: string;
}

export const nav17Demo: Nav17Props = {};

export function Nav17({ className }: Nav17Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="relative flex w-52 flex-col gap-0.5 rounded-lg border border-border bg-card/95 p-1 shadow-xl backdrop-blur">
        <span
          className="absolute -left-2 -top-1 size-2 rotate-45 border-l border-t border-border bg-card"
          aria-hidden="true"
        />
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Copy className="size-3.5" aria-hidden="true" />
          Copy
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            ⌘C
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Scissors className="size-3.5" aria-hidden="true" />
          Cut
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            ⌘X
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Link2 className="size-3.5" aria-hidden="true" />
          Copy link
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-card-foreground hover:bg-muted"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
          Share…
        </button>
      </div>
    </div>
  );
}
