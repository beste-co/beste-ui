"use client";

import { cn } from "@/lib/utils";

interface Shapes49Props {
  className?: string;
}

export const shapes49Demo: Shapes49Props = {};

export function Shapes49({ className }: Shapes49Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="grid h-32 w-48 grid-cols-3 grid-rows-3 gap-1.5"
        aria-hidden="true"
      >
        <div className="col-span-2 row-span-2 flex flex-col gap-1.5 rounded-md border border-border bg-card p-2">
          <span className="size-4 rounded-sm bg-foreground/70" />
          <span className="mt-auto h-1 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-1 w-1/2 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-1.5">
          <span className="size-2.5 rounded-sm bg-foreground/70" />
          <span className="mt-auto h-1 w-2/3 rounded-full bg-muted" />
        </div>
        <div className="flex flex-col gap-1 rounded-md border border-border bg-card p-1.5">
          <span className="size-2.5 rounded-sm bg-foreground/70" />
          <span className="mt-auto h-1 w-3/4 rounded-full bg-muted" />
        </div>
        <div className="col-span-3 flex items-center gap-2 rounded-md border border-border bg-card p-2">
          <span className="size-3 shrink-0 rounded-sm bg-foreground/70" />
          <span className="h-1 w-1/3 rounded-full bg-foreground/70" />
          <span className="ml-auto h-1 w-8 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
