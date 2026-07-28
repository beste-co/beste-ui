"use client";

import { cn } from "@/lib/utils";

interface Shapes69Props {
  className?: string;
}

export const shapes69Demo: Shapes69Props = {};

export function Shapes69({ className }: Shapes69Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-48 flex-col items-center gap-2.5 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        <span className="h-1.5 w-24 rounded-full bg-foreground/70" />
        <span className="h-1 w-32 rounded-full bg-muted" />
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-background">
            <span className="h-2.5 w-1 rounded-full bg-foreground/70" />
          </span>
          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-background">
            <span className="h-2.5 w-1 rounded-full bg-foreground/70" />
          </span>
          <span className="size-8 rounded-md border-2 border-foreground bg-background" />
          <span className="size-8 rounded-md border border-border bg-background" />
        </div>
        <span className="mt-1 h-6 w-full rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
