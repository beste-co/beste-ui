"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes34Props {
  className?: string;
}

export const shapes34Demo: Shapes34Props = {};

export function Shapes34({ className }: Shapes34Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-44 flex-col gap-1.5" aria-hidden="true">
        <div className="flex flex-col gap-2 rounded-md border border-border bg-card px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="h-1.5 w-24 rounded-full bg-foreground/70" />
            <ChevronDown className="size-3 rotate-180 text-muted-foreground" />
          </div>
          <span className="h-1 w-full rounded-full bg-muted" />
          <span className="h-1 w-3/4 rounded-full bg-muted" />
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
          <span className="h-1.5 w-20 rounded-full bg-muted" />
          <ChevronDown className="size-3 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
          <span className="h-1.5 w-28 rounded-full bg-muted" />
          <ChevronDown className="size-3 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
