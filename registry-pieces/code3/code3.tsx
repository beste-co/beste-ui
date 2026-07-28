"use client";

import { cn } from "@/lib/utils";

interface Code3Props {
  command?: string;
  className?: string;
}

export const code3Demo: Code3Props = {
  command: "bun add @beste/ui",
};

export function Code3({ command, className }: Code3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className="flex w-full max-w-80 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
        <span
          className="select-none font-mono text-sm text-muted-foreground"
          aria-hidden="true"
        >
          $
        </span>
        <code className="flex-1 truncate font-mono text-sm text-card-foreground">
          {command}
        </code>
      </div>
    </div>
  );
}
