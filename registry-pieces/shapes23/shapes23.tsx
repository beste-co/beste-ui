"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes23Props {
  className?: string;
}

export const shapes23Demo: Shapes23Props = {};

export function Shapes23({ className }: Shapes23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex h-9 w-44 items-center gap-2 rounded-full border border-border bg-card px-3 shadow-sm"
        aria-hidden="true"
      >
        <Search className="size-4 text-muted-foreground" />
        <span className="h-1 w-20 rounded-full bg-muted" />
      </div>
    </div>
  );
}
