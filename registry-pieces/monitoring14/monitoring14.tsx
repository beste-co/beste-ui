"use client";

import { cn } from "@/lib/utils";

interface Monitoring14Props {
  read?: string;
  write?: string;
  bordered?: boolean;
  className?: string;
}

export const monitoring14Demo: Monitoring14Props = {
  read: "42 MB/s",
  write: "18 MB/s",
  bordered: false,
};

export function Monitoring14({
  read,
  write,
  bordered = false,
  className,
}: Monitoring14Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex flex-col gap-1 rounded-md bg-card px-3 py-2 text-xs shadow-sm", bordered && "border border-border")}>
        <div className="flex items-center gap-2">
          <span className="w-4 text-muted-foreground">R</span>
          <span className="tabular-nums text-card-foreground">{read}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 text-muted-foreground">W</span>
          <span className="tabular-nums text-card-foreground">{write}</span>
        </div>
      </div>
    </div>
  );
}
