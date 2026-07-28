"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Monitoring14Props {
  read?: string;
  write?: string;
  className?: string;
}

export const monitoring14Demo: Monitoring14Props = {
  read: "42 MB/s",
  write: "18 MB/s",
};

export function Monitoring14({
  read,
  write,
  className,
}: Monitoring14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex flex-col gap-1 rounded-md border border-border bg-card px-3 py-2 font-mono text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <ArrowDown
            className="size-3 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="w-4 text-muted-foreground">R</span>
          <span className="tabular-nums text-card-foreground">{read}</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUp
            className="size-3 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="w-4 text-muted-foreground">W</span>
          <span className="tabular-nums text-card-foreground">{write}</span>
        </div>
      </div>
    </div>
  );
}
