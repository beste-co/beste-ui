"use client";

import { Redo2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toolbar9Props {
  canUndo?: boolean;
  canRedo?: boolean;
  bordered?: boolean;
  className?: string;
}

export const toolbar9Demo: Toolbar9Props = {
  canUndo: true,
  canRedo: false,
  bordered: false,
};

export function Toolbar9({
  canUndo = true,
  canRedo = true,
  bordered = false,
  className,
}: Toolbar9Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-0.5 rounded-lg bg-card p-1 shadow-sm", bordered && "border border-border")}>
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
