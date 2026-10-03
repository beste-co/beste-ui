"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Browser23Props {
  blocked?: number;
  bordered?: boolean;
  className?: string;
}

export const browser23Demo: Browser23Props = {
  blocked: 17,
  bordered: false,
};

export function Browser23({ blocked = 0, bordered = false, className }: Browser23Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("inline-flex items-center gap-2.5 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
        <ShieldCheck
          className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
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
