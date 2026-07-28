"use client";

import { Regex } from "lucide-react";
import { cn } from "@/lib/utils";

interface Input28Props {
  pattern?: string;
  flags?: string;
  matches?: number;
  className?: string;
}

export const input28Demo: Input28Props = {
  pattern: "^[a-z]+@beste\\.co$",
  flags: "gi",
  matches: 42,
};

export function Input28({
  pattern = "",
  flags = "",
  matches,
  className,
}: Input28Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 shadow-sm">
        <Regex
          className="size-3.5 shrink-0 text-violet-500"
          aria-hidden="true"
        />
        <span className="font-mono text-xs text-muted-foreground">/</span>
        <span className="flex-1 truncate font-mono text-xs text-card-foreground">
          {pattern}
        </span>
        <span className="font-mono text-xs text-muted-foreground">/</span>
        <span className="font-mono text-xs text-amber-600 dark:text-amber-400">
          {flags}
        </span>
        {typeof matches === "number" && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {matches}
          </span>
        )}
      </div>
    </div>
  );
}
