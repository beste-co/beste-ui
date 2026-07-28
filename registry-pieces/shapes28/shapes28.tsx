"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes28Props {
  className?: string;
}

export const shapes28Demo: Shapes28Props = {};

export function Shapes28({ className }: Shapes28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-1.5 w-8 rounded-full bg-muted" />
        <ChevronRight className="size-3 text-muted-foreground" />
        <span className="h-1.5 w-10 rounded-full bg-muted" />
        <ChevronRight className="size-3 text-muted-foreground" />
        <span className="h-1.5 w-6 rounded-full bg-foreground" />
      </div>
    </div>
  );
}
