"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser23Props {
  blocked?: number;
  className?: string;
}

export const browser23Demo: Browser23Props = {
  blocked: 17,
};

export function Browser23({ blocked = 0, className }: Browser23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="inline-flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
          aria-hidden="true"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tabular-nums leading-none text-card-foreground">
            {blocked}
          </span>
          <span className="text-xs text-muted-foreground">
            trackers blocked
          </span>
        </div>
      </div>
    </div>
  );
}
