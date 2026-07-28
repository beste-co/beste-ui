"use client";

import { BookOpen, Minus, Moon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser13Props {
  fontSize?: number;
  className?: string;
}

export const browser13Demo: Browser13Props = {
  fontSize: 18,
};

export function Browser13({ fontSize = 16, className }: Browser13Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-72 items-center justify-between gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Reader
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Decrease font"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Minus className="size-3" aria-hidden="true" />
          </button>
          <span className="w-7 text-center font-mono text-xs tabular-nums text-card-foreground">
            {fontSize}
          </span>
          <button
            type="button"
            aria-label="Increase font"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Plus className="size-3" aria-hidden="true" />
          </button>
          <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <button
            type="button"
            aria-label="Theme"
            className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground"
          >
            <Moon className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
