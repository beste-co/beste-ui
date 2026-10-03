"use client";

import { cn } from "@/lib/utils";

interface Code3Props {
  command?: string;
  bordered?: boolean;
  className?: string;
}

export const code3Demo: Code3Props = {
  command: "bun add @beste/ui",
  bordered: false,
};

export function Code3({ command, bordered = false, className }: Code3Props) {
  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center p-4",
        className
      )}
    >
      <div className={cn("flex w-full max-w-80 items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-sm", bordered && "border border-border")}>
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
