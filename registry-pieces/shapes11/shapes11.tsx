"use client";

import { cn } from "@/lib/utils";

interface Shapes11Props {
  bordered?: boolean;
  className?: string;
}

export const shapes11Demo: Shapes11Props = {
  bordered: false,
};

export function Shapes11({ bordered = false, className }: Shapes11Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-7 w-14 rounded-full bg-primary" />
        <span className="h-7 w-20 rounded-full bg-muted-foreground" />
        <span className={cn("h-7 w-12 rounded-full", bordered ? "border border-border bg-background" : "bg-card")} />
      </div>
    </div>
  );
}
