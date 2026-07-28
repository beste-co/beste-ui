"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shapes66Props {
  className?: string;
}

export const shapes66Demo: Shapes66Props = {};

export function Shapes66({ className }: Shapes66Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div
        className="flex w-44 flex-col gap-2 rounded-md border border-border bg-card p-3 shadow-sm"
        aria-hidden="true"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="h-1 w-10 rounded-full bg-muted" />
            <span className="h-6 w-full rounded-sm border border-border bg-background" />
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="flex size-3 items-center justify-center rounded-sm bg-foreground">
            <Check className="size-2 text-background" />
          </span>
          <span className="h-1 w-24 rounded-full bg-muted" />
        </div>
        <span className="h-6 w-full rounded-sm bg-foreground" />
      </div>
    </div>
  );
}
