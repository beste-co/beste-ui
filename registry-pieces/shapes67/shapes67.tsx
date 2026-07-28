"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes67Props {
  className?: string;
}

export const shapes67Demo: Shapes67Props = {};

export function Shapes67({ className }: Shapes67Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-48 flex-col gap-2" aria-hidden="true">
        <div className="flex h-7 items-center gap-2 rounded-full border border-border bg-card px-3">
          <Search className="size-3 text-muted-foreground" />
          <span className="h-1 w-20 rounded-full bg-muted" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="h-5 w-12 rounded-full bg-foreground/70" />
          <span className="h-5 w-14 rounded-full border border-border bg-card" />
          <span className="h-5 w-10 rounded-full border border-border bg-card" />
          <span className="h-5 w-12 rounded-full border border-border bg-card" />
        </div>
      </div>
    </div>
  );
}
