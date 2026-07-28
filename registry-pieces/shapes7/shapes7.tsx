"use client";

import { cn } from "@/lib/utils";

interface Shapes7Props {
  className?: string;
}

export const shapes7Demo: Shapes7Props = {};

export function Shapes7({ className }: Shapes7Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="grid grid-cols-4 gap-3" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, i) => (
          <span key={i} className="size-1.5 rounded-full bg-foreground" />
        ))}
      </div>
    </div>
  );
}
