"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes79Props {
  className?: string;
}

export const shapes79Demo: Shapes79Props = {};

export function Shapes79({ className }: Shapes79Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col items-center gap-2 rounded-md border border-border bg-card p-4"
        aria-hidden="true"
      >
        <Inbox className="size-8 text-muted-foreground/50" />
        <div className="flex flex-col items-center gap-1">
          <span className="h-1.5 w-24 rounded-full bg-foreground/70" />
          <span className="h-1 w-32 rounded-full bg-muted" />
        </div>
        <span className="mt-1 h-5 w-16 rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
