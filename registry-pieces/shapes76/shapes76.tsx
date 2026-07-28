"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes76Props {
  className?: string;
}

export const shapes76Demo: Shapes76Props = {};

export function Shapes76({ className }: Shapes76Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col items-center gap-2 rounded-md border-2 border-dashed border-border bg-card p-5"
        aria-hidden="true"
      >
        <Upload className="size-7 text-muted-foreground" />
        <div className="flex flex-col items-center gap-1">
          <span className="h-1.5 w-24 rounded-full bg-foreground/70" />
          <span className="h-1 w-16 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
