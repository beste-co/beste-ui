"use client";

import { Redo2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar9Props {
  canUndo?: boolean;
  canRedo?: boolean;
  className?: string;
}

export const toolbar9Demo: Toolbar9Props = {
  canUndo: true,
  canRedo: false,
};

export function Toolbar9({
  canUndo = true,
  canRedo = true,
  className,
}: Toolbar9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          aria-label="Undo"
          disabled={!canUndo}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Undo2 className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          disabled={!canRedo}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-card-foreground disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <Redo2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
