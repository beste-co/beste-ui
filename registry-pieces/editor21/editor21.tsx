"use client";

import { Regex } from "lucide-react";
import { cn } from "@/lib/utils";

interface Editor21Props {
  pattern?: string;
  flags?: string;
  matches?: number;
  className?: string;
}

export const editor21Demo: Editor21Props = {
  pattern: "\\b\\w+@\\w+\\.com\\b",
  flags: "gi",
  matches: 12,
};

export function Editor21({
  pattern = "",
  flags = "",
  matches = 0,
  className,
}: Editor21Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 shadow-sm">
        <Regex
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 items-center font-mono text-xs">
          <span className="text-muted-foreground">/</span>
          <span className="truncate text-card-foreground">{pattern}</span>
          <span className="text-muted-foreground">/</span>
          <span className="ml-0.5 text-violet-600 dark:text-violet-400">
            {flags}
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-xs font-semibold tabular-nums text-card-foreground">
          {matches}
        </span>
      </div>
    </div>
  );
}
