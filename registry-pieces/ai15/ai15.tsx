"use client";

import { Copy, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Reaction = "up" | "down" | null;

interface Ai15Props {
  reaction?: Reaction;
  className?: string;
}

export const ai15Demo: Ai15Props = {
  reaction: "up",
};

export function Ai15({ reaction = null, className }: Ai15Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          aria-label="Helpful"
          aria-pressed={reaction === "up"}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            reaction === "up"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
          )}
        >
          <ThumbsUp
            className={cn("size-3.5", reaction === "up" && "fill-current")}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          aria-label="Not helpful"
          aria-pressed={reaction === "down"}
          className={cn(
            "flex size-7 items-center justify-center rounded-full transition-colors",
            reaction === "down"
              ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
              : "text-muted-foreground hover:bg-muted hover:text-card-foreground"
          )}
        >
          <ThumbsDown
            className={cn(
              "size-3.5",
              reaction === "down" && "fill-current"
            )}
            aria-hidden="true"
          />
        </button>
        <div className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          aria-label="Copy"
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Copy className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Share"
          className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
        >
          <Share2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
